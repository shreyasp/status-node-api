import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResultCallback, auto as asyncAuto } from 'async';
import { Credentials, S3 } from 'aws-sdk';
import {
  ceil,
  isEmpty,
  map as loMap,
  omit,
  set as loSet,
  find as loFind,
  shuffle,
  startCase,
  toNumber,
  filter as loFilter,
} from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { AppConfigService } from '../AppConfig/AppConfig.service';
import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { Image } from './TemplateImage.entity';
import { WizardPage } from '../TemplateWizardPage/TemplateWizardPage.entity';

@Injectable()
class ImageService {
  accountId: string;
  assumedRole: string;
  awsRegion: string;
  bucketName: string;

  constructor(
    @InjectRepository(Image) private readonly ImageRepository: Repository<Image>,
    @InjectRepository(WizardPage) private readonly WizardPageRepository: Repository<WizardPage>,
    config: AppConfigService,
  ) {
    this.accountId = config.accountId;
    this.assumedRole = config.assumedRole;
    this.awsRegion = config.awsRegion;
    this.bucketName = config.bucketName;
  }

  // Temporary credentials to be used for uploading image object to S3.
  tempCredentials: Credentials;

  findAllImages(page: number = 1, limit: number = 10) {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    const offset = (page - 1) * limit;
    return queryBuilder
      .where({ isActive: true })
      .limit(limit)
      .offset(offset)
      .getManyAndCount()
      .then(data => {
        /**
         * getManyAndCount returns array with first element as data and
         * second element as total number of objects irrespective of the
         * limit value prescribed.
         */
        const images = data[0];
        const totalImages = data[1];

        if (isEmpty(images))
          return {
            success: true,
            message: `No active could be fetched from the database`,
            data: {
              images: [],
              totalPages: 0,
              currentPage: 1,
            },
          };

        return {
          success: true,
          message: `Images fetched successfully`,
          data: {
            images: shuffle(loMap(images, image => omit(image, ['EntId', 'isActive']))),
            totalPages: ceil(totalImages / limit),
            currentPage: toNumber(page),
          },
        };
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to fetch all active images`,
        err,
      }));
  }

  findOneImage(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncAuto(
        {
          getImageById: [
            (getImageCB: AsyncResultCallback<{}, {}>) => {
              const qBImage = this.ImageRepository.createQueryBuilder('Image');
              qBImage
                .where('id = :id', { id })
                .andWhere('Image.isActive = :isActive', { isActive: true })
                .getOne()
                .then(image => {
                  if (isEmpty(image)) getImageCB(null, false);
                  else getImageCB(null, image);
                })
                .catch(err => getImageCB(err));
            },
          ],
          getRawImageData: [
            (getRawImageCB: AsyncResultCallback<{}, {}>) => {
              const qBImage = this.ImageRepository.createQueryBuilder('Image');
              qBImage
                .where('id = :id', { id })
                .andWhere('Image.isActive = :isActive', { isActive: true })
                .getRawOne()
                .then(rawImageData => {
                  if (isEmpty(rawImageData)) getRawImageCB(null, false);
                  else getRawImageCB(null, rawImageData);
                })
                .catch(err => getRawImageCB(err));
            },
          ],
          getLayersForImage: [
            'getImageById',
            (result: any, getLayerCB: AsyncResultCallback<{}, {}>) => {
              if (!result.getImageById) getLayerCB(null, {});
              else {
                const qbLayers = this.ImageRepository.createQueryBuilder('Image');
                qbLayers
                  .innerJoinAndSelect('Image.layers', 'layer')
                  .where('layer.type = :type', { type: 'text' })
                  .andWhere('layer.image = :id', { id })
                  .getOne()
                  .then(layers => getLayerCB(null, layers))
                  .catch(err => getLayerCB(err));
              }
            },
          ],
          getWizardPageByCategory: [
            'getImageById',
            'getRawImageData',
            (result: any, getWizardPageCB: AsyncResultCallback<{}, {}>) => {
              if (!result.getImageById) getWizardPageCB(null, {});
              else {
                const categoryId = result.getRawImageData.Image_categoryId;
                const qbWizardPage = this.ImageRepository.createQueryBuilder('Image');
                qbWizardPage
                  .leftJoinAndMapMany(
                    'Image.pages',
                    WizardPage,
                    'wizardPage',
                    'wizardPage.category = Image.category',
                  )
                  .where('wizardPage.category = :categoryId', { categoryId })
                  .getOne()
                  .then(data => {
                    if (isEmpty(data)) getWizardPageCB(null, false);
                    else getWizardPageCB(null, data);
                  })
                  .catch(err => getWizardPageCB(err));
              }
            },
          ],
          transformImageResp: [
            'getLayersForImage',
            'getWizardPageByCategory',
            (result: any, transImgRespCB: AsyncResultCallback<{}, {}>) => {
              if (!result.getImageById) transImgRespCB(null, {});
              else {
                const layers = result.getLayersForImage.layers;
                const wizardPages = result.getWizardPageByCategory.pages;
                let image = result.getImageById;

                const qbLayerMaster = this.WizardPageRepository.createQueryBuilder('wizardPage');
                qbLayerMaster
                  .leftJoinAndSelect('wizardPage.layerMasters', 'layerMaster')
                  .getMany()
                  .then(wizardPages => {
                    const pages = loMap(wizardPages, page => {
                      const layerPageMap = loMap(page.layerMasters, layerMaster => {
                        const mappedLayer = loFind(
                          layers,
                          o => o.layerMasterId === layerMaster.layerMasterId,
                        );

                        return (
                          mappedLayer &&
                          omit(loSet(mappedLayer, 'displayName', startCase(mappedLayer.name)), [
                            'EntId',
                            'layerId',
                            'alignment',
                            'layerParent',
                            'isActive',
                            'layerMasterId',
                          ])
                        );
                      });

                      page = loSet(
                        page,
                        'layers',
                        loFilter(layerPageMap, layer => !isEmpty(layer)),
                      );

                      return omit(page, [
                        'EntId',
                        'createdDate',
                        'category',
                        'isActive',
                        'layerMasters',
                        'updatedDate',
                        'pageId',
                      ]);
                    });

                    image = loSet(image, 'pages', pages);
                    transImgRespCB(null, image);
                  })
                  .catch(err => transImgRespCB(err));
              }
            },
          ],
        },
        Infinity,
        (err: Error, result: any) => {
          if (err) {
            reject({
              success: false,
              message: `Something went wrong while trying to get the Image with id: ${id}`,
              err,
            });
          } else {
            if (!result.getImageById) {
              resolve({
                success: true,
                message: `No Image with id:${id} found in the database`,
                data: {},
              });
            }

            resolve({
              success: true,
              message: `Successfully retrieved Image with Id: ${id}`,
              data: omit(result.transformImageResp, ['EntId', 'isActive']),
            });
          }
        },
      );
    });
  }

  findImageByCategoryId(
    category: DeepPartial<Category>,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    const offset = (page - 1) * limit;
    return queryBuilder
      .innerJoinAndSelect('Image.category', 'category', 'Image.category = :category', {
        category,
      })
      .where({ isActive: true })
      .limit(limit)
      .offset(offset)
      .getManyAndCount()
      .then(data => {
        /**
         * getManyAndCount returns array with first element as data and
         * second element as total number of objects irrespective of the
         * limit value prescribed.
         */
        const images = data[0];
        const totalImages = data[1];

        if (isEmpty(images)) {
          return {
            success: true,
            message: 'No Images found for given category',
            data: {
              images,
              totalPages: 1,
              currentPage: page,
            },
          };
        }

        return {
          success: true,
          message: 'Images fetched successfully for given category',
          data: {
            images: shuffle(
              loMap(images, image => omit(image, ['category', 'EntId', 'Id', 'isActive'])),
            ),
            totalPages: ceil(totalImages / limit),
            currentPage: toNumber(page),
          },
        };
      })
      .catch(err => err);
  }

  createImage(imageName: string, categoryId: DeepPartial<Category>): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncAuto(
        {
          createDBObject: [
            (autoCallback: AsyncResultCallback<{}, {}>) => {
              this.ImageRepository.save({
                isActive: true,
                category: categoryId,
                name: imageName,
              })
                .then(image => autoCallback(null, image))
                .catch(err => autoCallback(err));
            },
          ],
        },
        Infinity,
        (err: Error, results: any) => {
          if (err) reject(err);
          resolve(results.createDBObject);
        },
      );
    });
  }

  toggleImageActive(id: number) {
    return this.ImageRepository.update({ id }, { isActive: false })
      .then(updated => ({
        success: true,
        message: `Image Id: ${id} updated successfully`,
      }))
      .catch(err => err);
  }

  uploadTemplateBackground(id: number, uniqName: string, background: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uploadImageToS3(background, 'backgrounds', uniqName)
        .then(data => {
          this.ImageRepository.update({ id }, { templateBackgroundUrl: data });
          resolve({
            success: true,
            message: 'Uploaded template background successfully',
          });
        })
        .catch(err =>
          reject({
            success: false,
            message: 'Error while trying to upload',
            err,
          }),
        );
    });
  }

  uploadTemplate(id: number, uniqName: string, template: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uploadImageToS3(template, 'templates', uniqName)
        .then(data => {
          this.ImageRepository.update({ id }, { templateUrl: data });
          resolve({
            success: true,
            message: 'Uploaded template successfully',
          });
        })
        .catch(err =>
          reject({
            success: false,
            message: 'Error while trying to upload',
            err,
          }),
        );
    });
  }

  updateTrendingNow(id: number, isTrendingNow: boolean): Promise<any> {
    return this.ImageRepository.update({ id }, { isTrendingNow })
      .then(updated => ({
        success: true,
        message: `Image Id: ${id} updated successfully`,
      }))
      .catch(err => err);
  }

  getTrendingImages(page: number = 1, limit: number = 10): Promise<any> {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    const offset = (page - 1) * limit;
    return queryBuilder
      .where({ isTrendingNow: true })
      .limit(limit)
      .offset(offset)
      .getManyAndCount()
      .then(data => {
        /**
         * getManyAndCount returns array with first element as data and
         * second element as total number of objects irrespective of the
         * limit value prescribed.
         */
        const images = data[0];
        const totalImages = data[1];

        if (isEmpty(images)) {
          return {
            success: true,
            message: 'No Images found for given category',
            data: {
              images,
              totalPages: 1,
              currentPage: page,
            },
          };
        }

        return {
          success: true,
          message: 'Images fetched successfully for given category',
          data: {
            images: shuffle(
              loMap(images, image =>
                omit(image, ['category', 'EntId', 'Id', 'isActive', 'isTrendingNow']),
              ),
            ),
            totalPages: ceil(totalImages / limit),
            currentPage: toNumber(page),
          },
        };
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to fetch all active images`,
        err,
      }));
  }

  async uploadImageToS3(image: any, type: string, uniqName?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      assumeS3Role(
        `${this.accountId}`,
        `${this.assumedRole}`,
        `s3-${type}-upload`,
        `${this.awsRegion}`,
        's3:*',
        `${this.bucketName}`,
      )
        .then(credentials => {
          const s3Uploader: S3 = new S3({ credentials });
          const imageName = uniqName !== undefined ? `${uniqName}-${type}.jpg` : image.originalname;
          putS3Object(
            s3Uploader,
            `${this.awsRegion}`,
            `${this.bucketName}`,
            `images/${type}/${imageName}`,
            image.buffer,
            true,
          )
            .then(data => resolve(data))
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export { ImageService };
