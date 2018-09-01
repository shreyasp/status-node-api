import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { Credentials, S3 } from 'aws-sdk';

import { Font } from './TemplateFont.entity';

@Injectable()
class FontService {
    constructor(
        @InjectRepository(Font)
        private readonly FontRepository: Repository<Font>,
    ){}

    // Temporary credentials to be used for uploading font object
    // to S3.
    tempCredentials: Credentials;

    // Query Builder object to do Fetch/Update the DB Objects
    queryBuilder = this.FontRepository.createQueryBuilder('font');

    // Retrieve all the active Font
    findAllFonts() {
        return this.FontRepository.find({ common: {isActive: true } })
            .then((fonts) => fonts)
            .catch((err) => err);
    }

    // Retrieve Specific Font
    findOneFont(id: number) {
        return this.queryBuilder.where(
            'font.fontId = :fontId',
            {fontId: id},
        )
        .getOne()
        .then((font) => font)
        .catch((err) => err);
    }

    // Font creation activity would involve creating a font object in
    // DB which has reference to its path
    async createFont(font: any) {
        // Get temporary credentials for uploading to S3 Bucket
        this.tempCredentials = await assumeS3Role(
            '369329776707',
            'Test',
            'S3-Upload-Session',
            'ap-south-1',
            's3:PutObject',
            'test-sts-role-bucket',
        );

        // Put the font in the bucket
        const s3Uploader: S3 = new S3({credentials: this.tempCredentials});
        putS3Object(s3Uploader, 'test-sts-role-bucket', 'fonts/test.ttf', font.buffer);
    }

    // Note: We won't have 'DELETE' REST call for fonts, as we
    // would just want to activate or deactivate a font.
    toggleFontActive(id: number) {
        return this.FontRepository.update(
            {fontId: id}, {common: {isActive: false}},
        );
    }

}

export { FontService };