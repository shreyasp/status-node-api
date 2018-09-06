import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResultCallback, auto as asyncAuto, each as asyncEach, ErrorCallback } from 'async';
import { Credentials, S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { forEach as lodashForEach } from 'lodash';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { Image } from './TemplateImage.entity';

@Injectable()
class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly ImageRepository: Repository<Image>,
    ){}

    // Temporary credentials to be used for uploading image object
    // to S3.
    tempCredentials: Credentials;

    // Query Builder object to do Fetch/Update the DB Objects
    queryBuilder = this.ImageRepository.createQueryBuilder('Image');

    findAllImages() {
        return this.ImageRepository.find({ isActive: true })
            .then((images) => images)
            .catch((err) => err);
    }

    findOneImage(id: number) {
        return this.queryBuilder.where(
            'image.imageId = :imageId',
            {imageId: id},
        )
        .getOne()
        .then((image) => image)
        .catch((err) => err);
    }

    createImage(imageName: string, images: any) {
        asyncAuto({
            uploadImages: (autoCallback: AsyncResultCallback<{}, {}>) => {
                lodashForEach(images, (image) => {
                    this.uploadImageToS3(image)
                        .then((data) => autoCallback(null, {s3Path: data.s3Path}))
                        .catch((err) => autoCallback(err));
                });
            },
            createDBObject: ['uploadImages', (results, autoCallback: AsyncResultCallback<{}, {}>) => {
                console.log(results.uploadImages);
            }],
        }, Infinity, (err, results) => {
            if (err) return err;
            return results;
        });
    }

    toggleImageActive(id: number) {
        return this.ImageRepository.update(
            {imageId: id}, { isActive: false },
        );
    }

    async uploadImageToS3(image: any): Promise<any> {
        this.tempCredentials = await assumeS3Role(
            '369329776707',
            'Test',
            'S3-Upload-Session',
            'ap-south-1',
            's3:PutObject',
            'test-sts-role-bucket',
        );

        const s3Uploader: S3 = new S3({credentials: this.tempCredentials});
        const data = await putS3Object(s3Uploader, 'ap-south-1', 'test-sts-role-bucket',
            `images/${image.originalname}`, image.buffer);

        return new Promise((resolve, reject) => {
            if (!data.success) {
                reject(data.err);
            } else {
                resolve(data);
            }
        });
    }
}

export { ImageService };