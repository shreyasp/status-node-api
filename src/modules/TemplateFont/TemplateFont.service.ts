import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AsyncResultCallback,
  auto as asyncAuto,
  eachOfSeries as asyncEachOfSeries,
  ErrorCallback,
} from 'async';
import { Credentials, S3 } from 'aws-sdk';
import { split } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { AppConfigService } from '../AppConfig/AppConfig.service';
import { Font } from './TemplateFont.entity';

@Injectable()
class FontService {
  constructor(@InjectRepository(Font) private readonly FontRepository: Repository<Font>) {}

  // Temporary credentials to be used for uploading font object
  // to S3.
  tempCredentials: Credentials;
  config = new AppConfigService().readAppConfig();

  // Retrieve all the active Font
  findAllFonts() {
    return this.FontRepository.find({ isActive: true })
      .then(fonts => fonts)
      .catch(err => err);
  }

  // Retrieve Specific Font
  findOneFont(id: number) {
    const queryBuilder = this.FontRepository.createQueryBuilder('font');
    return queryBuilder
      .where('font.id = :id', { id })
      .getOne()
      .then(font => font)
      .catch(err => err);
  }

  // Font creation activity would involve creating a font object in
  // DB which has reference to its path
  async createFont(fonts: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncAuto(
        {
          uploadFonts: (autoCallback: AsyncResultCallback<{}, {}>) => {
            const paths: string[] = [];
            asyncEachOfSeries(
              fonts,
              (font: any, idx: number, eachCallback: ErrorCallback<{}>) => {
                this.uploadFontToS3(font)
                  .then(data => {
                    paths.push(data);
                    eachCallback(null);
                  })
                  .catch(err => {
                    eachCallback(err);
                  });
              },
              err => {
                if (err) autoCallback(err);
                autoCallback(null, paths);
              },
            );
          },
          createDBObject: [
            'uploadFonts',
            (results: any, autoCallback: AsyncResultCallback<{}, {}>) => {
              const savedFonts: DeepPartial<Font>[] = [];
              asyncEachOfSeries(
                fonts,
                (font, idx, eachCallback: ErrorCallback<{}>) => {
                  const fontObj: string[] = split(font.originalname, '.');
                  this.FontRepository.save({
                    fontPath: results.uploadFonts[idx],
                    fontName: fontObj[0],
                    fontExtension: fontObj[1],
                    isActive: true,
                  })
                    .then(createdFont => {
                      savedFonts.push(createdFont);
                      eachCallback(null);
                    })
                    .catch(err => {
                      eachCallback(err);
                    });
                },
                err => {
                  if (err) autoCallback(err);
                  autoCallback(null, savedFonts);
                },
              );
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

  // Note: We won't have 'DELETE' REST call for fonts, as we
  // would just want to activate or deactivate a font.
  toggleFontActive(id: number) {
    return this.FontRepository.update({ id }, { isActive: false });
  }

  async uploadFontToS3(font: any): Promise<any> {
    return new Promise((resolve, reject) => {
      assumeS3Role(
        `${this.config.accountId}`,
        `${this.config.assumedRole}`,
        `s3-font-upload`,
        `${this.config.awsRegion}`,
        's3:*',
        `${this.config.bucketName}`,
      )
        .then(credentials => {
          const s3Uploader: S3 = new S3({ credentials });
          putS3Object(
            s3Uploader,
            `${this.config.awsRegion}`,
            `${this.config.bucketName}`,
            `fonts/${font.originalname}`,
            font.buffer,
            true,
          )
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

export { FontService };
