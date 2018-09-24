import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AsyncResultCallback,
  auto as asyncAuto,
  eachSeries as asyncEachSeries,
  ErrorCallback,
} from 'async';
import { Credentials, S3 } from 'aws-sdk';
import { replace as lodashReplace } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { Category } from '../TemplateCategory/TemplateCategory.entity';
import { Image } from './TemplateImage.entity';

@Injectable()
class ImageService {
  constructor(@InjectRepository(Image) private readonly ImageRepository: Repository<Image>) {}

  // Temporary credentials to be used for uploading image object
  // to S3.
  tempCredentials: Credentials;

  // Query Builder object to do Fetch/Update the DB Objects
  queryBuilder = this.ImageRepository.createQueryBuilder('Image');

  findAllImages() {
    return this.ImageRepository.find({ isActive: true })
      .then(images => images)
      .catch(err => err);
  }

  findOneImage(id: number) {
    return this.queryBuilder
      .where('id = :id', { id })
      .getOne()
      .then(image => image)
      .catch(err => err);
  }

  createImage(imageName: string, categoryId: DeepPartial<Category>, images: any): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncAuto(
        {
          uploadImages: (autoCallback: AsyncResultCallback<{}, {}>) => {
            const paths: string[] = [];
            asyncEachSeries(
              images,
              (image, eachCallBack: ErrorCallback<{}>) => {
                this.uploadImageToS3(image)
                  .then(data => {
                    paths.push(data);
                    eachCallBack(null);
                  })
                  .catch(err => autoCallback(err));
              },
              (err: Error) => {
                if (!err) autoCallback(null, { s3Path: paths });
              },
            );
          },
          createDBObject: [
            'uploadImages',
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

  async uploadImageToS3(image: any): Promise<any> {
    return new Promise((resolve, reject) => {
      assumeS3Role(
        '369329776707',
        'Test',
        'S3-Upload-Session',
        'ap-south-1',
        's3:PutObject',
        'test-sts-role-bucket',
      )
        .then(credentials => {
          const imageName = lodashReplace(image.originalname, ' ', '');
          const s3Uploader: S3 = new S3({ credentials });
          putS3Object(
            s3Uploader,
            'ap-south-1',
            'test-sts-role-bucket',
            `images/${imageName}`,
            image.buffer,
          )
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

export { ImageService };
