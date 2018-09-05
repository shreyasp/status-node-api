import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResultCallback, auto as asyncAuto, each as asyncEach, ErrorCallback } from 'async';
import { Credentials, S3 } from 'aws-sdk';
import { Repository } from 'typeorm';

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

    createImage() {
        // TODO
    }

    toggleImageActive(id: number) {
        return this.ImageRepository.update(
            {imageId: id}, { isActive: false },
        );
    }

    // TODO Upload Template Master and Background to S3
}

export { ImageService };