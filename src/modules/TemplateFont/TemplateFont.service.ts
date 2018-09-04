import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';import { split } from 'lodash';
import { Repository } from 'typeorm';
import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { Credentials, S3 } from 'aws-sdk';
import {
    each as asyncEach,
    auto as asyncAuto,
    AsyncResultCallback,
    ErrorCallback,
} from 'async';

import { Font } from './TemplateFont.entity';
import { create } from 'domain';

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
    createFont(fonts: any[], createObj: any) {
        // Get temporary credentials for uploading to S3 Bucket
        asyncEach(fonts, (font, eachCallback: ErrorCallback<{}>) => {
            asyncAuto({
                uploadFontFile: async (autoCallback: AsyncResultCallback<{}, {}>) => {
                    const data: any = await this.uploadFontToS3(font);
                    if (!!data.success) {
                        autoCallback(undefined, {s3Path: data.s3Path});
                    } else {
                        autoCallback(data);
                    }
                },
                createDBObject: ['uploadFontFile', (results: any, autoCallback: AsyncResultCallback<{}, {}>) => {
                    const fontObj: string[] = split(font.originalname, '.');
                    this.FontRepository.save({
                            fontPath: results.uploadFontFile.s3Path,
                            fontName: fontObj[0],
                            fontExtension: fontObj[1],
                            common: { isActive: true },
                        },
                    ).catch((err) => autoCallback(err));
                }],
            }, undefined, (err, results: any) => {
                // console.log(err);
                if (err) eachCallback(err);
            });
        }, (err) => {
            if (err) {
                createObj = {
                    success: false,
                    err,
                };
            }
        });
    }

    // Note: We won't have 'DELETE' REST call for fonts, as we
    // would just want to activate or deactivate a font.
    toggleFontActive(id: number) {
        return this.FontRepository.update(
            {fontId: id}, {common: {isActive: false}},
        );
    }

    async uploadFontToS3(font: any): Promise<any> {
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
        const data = await putS3Object(s3Uploader, 'ap-south-1', 'test-sts-role-bucket',
            `fonts/${font.originalname}`, font.buffer);

        return new Promise((resolve, reject) => {
            if (!data.success) {
                reject(data.err);
            } else {
                resolve(data);
            }
        });
    }
}

export { FontService };