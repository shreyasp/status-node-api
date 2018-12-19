import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResultCallback, auto as asyncAuto } from 'async';
import { Credentials, S3 } from 'aws-sdk';
import {
  ceil,
  isEmpty,
  map as loMap,
  merge as loMerge,
  omit,
  set as loSet,
  shuffle,
  startCase,
  toNumber,
} from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { AppConfigService } from '../AppConfig/AppConfig.service';
import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { Image } from './TemplateImage.entity';

@Injectable()
class ImageService {
  accountId: string;
  assumedRole: string;
  awsRegion: string;
  bucketName: string;

  constructor(
    @InjectRepository(Image) private readonly ImageRepository: Repository<Image>,
    config: AppConfigService,
  ) {
    this.accountId = config.accountId;
    this.assumedRole = config.assumedRole;
    this.awsRegion = config.awsRegion;
    this.bucketName = config.bucketName;
  }

  // Temporary credentials to be used for uploading image object to S3.
  tempCredentials: Credentials;

  findAllImages(page: number = 1) {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    const offset = (page - 1) * 10;
    return queryBuilder
      .where({ isActive: true })
      .limit(10)
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
            totalPages: ceil(totalImages / 10),
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
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    return queryBuilder
      .where('id = :id', { id })
      .andWhere('Image.isActive = :isActive', { isActive: true })
      .getOne()
      .then(image => {
        // NOTE: No Image exists within the database, so just return the back message
        if (isEmpty(image)) {
          return {
            success: true,
            message: `No Image with id:${id} found in the database`,
            data: image,
          };
        }

        // NOTE: If Image exists, we need to check whether we have layers for the image
        return queryBuilder
          .innerJoinAndSelect('Image.layers', 'layer')
          .where('id = :id', { id })
          .andWhere('layer.type = :type', { type: 'text' })
          .getOne()
          .then(imageWLayers => {
            // NOTE: We don't have layers information and so we will just respond back with the
            // empty layer array in the response.
            if (isEmpty(imageWLayers)) {
              image.layers = [];
            } else {
              const modifiedLayers = loMap(imageWLayers.layers, layer =>
                omit(loSet(layer, 'displayName', startCase(layer.name)), [
                  'EntId',
                  'layerId',
                  'alignment',
                  'layerParent',
                  'isActive',
                ]),
              );
              loSet(imageWLayers, 'layers', modifiedLayers);

              // NOTE: After post-processing Image with Layers merge with Image object before
              // sending the response
              loMerge(image, imageWLayers);
            }

            return {
              success: true,
              message: `Image for id: ${id} successfully retrieved`,
              data: omit(image, ['isActive', 'EntId']),
            };
          })
          .catch(err => err);
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to get the Image with id: ${id}`,
        err,
      }));
  }

  findImageByCategoryId(category: DeepPartial<Category>, page: number = 1): Promise<any> {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    const offset = (page - 1) * 10;
    return queryBuilder
      .innerJoinAndSelect('Image.category', 'category', 'Image.category = :category', {
        category,
      })
      .where({ isActive: true })
      .limit(10)
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
            totalPages: ceil(totalImages / 10),
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
    return this.ImageRepository.update({ id }, { isActive: false });
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
          const imageName = uniqName !== undefined ? `${uniqName}-${type}.png` : image.originalname;
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
