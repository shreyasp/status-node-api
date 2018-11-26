'use strict';
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function(k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const async_1 = require('async');
const aws_sdk_1 = require('aws-sdk');
const lodash_1 = require('lodash');
const typeorm_2 = require('typeorm');
const aws_s3_utils_1 = require('../../utils/aws-s3.utils');
const AppConfig_service_1 = require('../AppConfig/AppConfig.service');
const TemplateFont_entity_1 = require('./TemplateFont.entity');
let FontService = class FontService {
  constructor(FontRepository) {
    this.FontRepository = FontRepository;
    this.config = new AppConfig_service_1.AppConfigService().readAppConfig();
  }
  findAllFonts() {
    return this.FontRepository.find({ isActive: true })
      .then(fonts => fonts)
      .catch(err => err);
  }
  findOneFont(id) {
    const queryBuilder = this.FontRepository.createQueryBuilder('font');
    return queryBuilder
      .where('font.id = :id', { id })
      .getOne()
      .then(font => font)
      .catch(err => err);
  }
  createFont(fonts) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        async_1.auto(
          {
            uploadFonts: autoCallback => {
              const paths = [];
              async_1.eachOfSeries(
                fonts,
                (font, idx, eachCallback) => {
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
              (results, autoCallback) => {
                const savedFonts = [];
                async_1.eachOfSeries(
                  fonts,
                  (font, idx, eachCallback) => {
                    const fontObj = lodash_1.split(font.originalname, '.');
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
          (err, results) => {
            if (err) reject(err);
            resolve(results.createDBObject);
          },
        );
      });
    });
  }
  toggleFontActive(id) {
    return this.FontRepository.update({ id }, { isActive: false });
  }
  uploadFontToS3(font) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        aws_s3_utils_1
          .assumeS3Role(
            `${this.config.accountId}`,
            `${this.config.assumedRole}`,
            `s3-font-upload`,
            `${this.config.awsRegion}`,
            's3:*',
            `${this.config.bucketName}`,
          )
          .then(credentials => {
            const s3Uploader = new aws_sdk_1.S3({ credentials });
            aws_s3_utils_1
              .putS3Object(
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
    });
  }
};
FontService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(TemplateFont_entity_1.Font)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  FontService,
);
exports.FontService = FontService;
//# sourceMappingURL=TemplateFont.service.js.map
