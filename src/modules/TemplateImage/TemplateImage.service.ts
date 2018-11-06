import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AsyncResultCallback,
  auto as asyncAuto,
  eachSeries as asyncEachSeries,
  ErrorCallback,
} from 'async';
import { Credentials, S3 } from 'aws-sdk';
import { isEmpty, map as loMap, omit, replace as lodashReplace, set as loSet } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { Image } from './TemplateImage.entity';

@Injectable()
class ImageService {
  constructor(@InjectRepository(Image) private readonly ImageRepository: Repository<Image>) {}

  // Temporary credentials to be used for uploading image object to S3.
  tempCredentials: Credentials;

  findAllImages() {
    return this.ImageRepository.find({ isActive: true })
      .then(images => {
        if (isEmpty(images))
          return {
            success: true,
            message: `No active could be fetched from the database`,
            data: [],
          };

        return {
          success: true,
          message: `Images fetched successfully`,
          data: loMap(images, image => omit(image, ['EntId', 'isActive'])),
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
      .innerJoinAndSelect('Image.layers', 'layer')
      .where('id = :id', { id })
      .andWhere('layer.type = :type', { type: 'text' })
      .getOne()
      .then(image => {
        if (isEmpty(image)) {
          return {
            success: true,
            message: `No Image with id:${id} found in the database`,
            data: null,
          };
        }

        const modifiedLayers = loMap(image.layers, layer =>
          omit(layer, ['EntId', 'layerId', 'alignment', 'layerParent', 'isActive']),
        );

        loSet(image, 'layers', modifiedLayers);

        return {
          success: true,
          message: `Image with id:${id} fetched successfully`,
          image,
        };
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to fetch image with id: ${id}`,
        err,
      }));
  }

  createImage(imageName: string, categoryId: DeepPartial<Category>): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncAuto(
        {
          createDBObject: [
            (results: any, autoCallback: AsyncResultCallback<{}, {}>) => {
              this.ImageRepository.save({
                templateUrl: results.uploadImages.s3Path[0],
                templateBackgroundUrl: results.uploadImages.s3Path[1],
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
            data: this.ImageRepository.findByIds([1]),
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

  async uploadImageToS3(image: any, type: string, uniqName?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      assumeS3Role(
        '178687425488',
        'STS-Prod-Role',
        `s3-${type}-upload`,
        'us-east-1',
        's3:*',
        'status-app-prod',
      )
        .then(credentials => {
          const s3Uploader: S3 = new S3({ credentials });
          const imageName = uniqName !== undefined ? `${uniqName}-${type}.png` : image.originalname;
          putS3Object(
            s3Uploader,
            'us-east-1',
            'status-app-prod',
            `images/${type}/${imageName}`,
            image.buffer,
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
