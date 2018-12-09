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
const AppConfig_service_1 = require('modules/AppConfig/AppConfig.service');
const typeorm_2 = require('typeorm');
const aws_s3_utils_1 = require('../../utils/aws-s3.utils');
const TemplateImage_entity_1 = require('./TemplateImage.entity');
let ImageService = class ImageService {
  constructor(ImageRepository, config) {
    this.ImageRepository = ImageRepository;
    this.accountId = config.accountId;
    this.assumedRole = config.assumedRole;
    this.awsRegion = config.awsRegion;
    this.bucketName = config.bucketName;
  }
  findAllImages(page = 1) {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    const offset = (page - 1) * 10;
    return queryBuilder
      .where({ isActive: true })
      .limit(10)
      .offset(offset)
      .getManyAndCount()
      .then(data => {
        const images = data[0];
        const totalImages = data[1];
        if (lodash_1.isEmpty(images))
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
            images: lodash_1.shuffle(
              lodash_1.map(images, image => lodash_1.omit(image, ['EntId', 'isActive'])),
            ),
            totalPages: lodash_1.ceil(totalImages / 10),
            currentPage: lodash_1.toNumber(page),
          },
        };
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to fetch all active images`,
        err,
      }));
  }
  findOneImage(id) {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
    return queryBuilder
      .where('id = :id', { id })
      .andWhere('Image.isActive = :isActive', { isActive: true })
      .getOne()
      .then(image => {
        if (lodash_1.isEmpty(image)) {
          return {
            success: true,
            message: `No Image with id:${id} found in the database`,
            data: image,
          };
        }
        return queryBuilder
          .innerJoinAndSelect('Image.layers', 'layer')
          .where('id = :id', { id })
          .andWhere('layer.type = :type', { type: 'text' })
          .getOne()
          .then(imageWLayers => {
            if (lodash_1.isEmpty(imageWLayers)) {
              image.layers = [];
            } else {
              const modifiedLayers = lodash_1.map(imageWLayers.layers, layer =>
                lodash_1.omit(lodash_1.set(layer, 'displayName', lodash_1.startCase(layer.name)), [
                  'EntId',
                  'layerId',
                  'alignment',
                  'layerParent',
                  'isActive',
                ]),
              );
              lodash_1.set(imageWLayers, 'layers', modifiedLayers);
              lodash_1.merge(image, imageWLayers);
            }
            return {
              success: true,
              message: `Image for id: ${id} successfully retrieved`,
              data: lodash_1.omit(image, ['isActive', 'EntId']),
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
  createImage(imageName, categoryId) {
    return new Promise((resolve, reject) => {
      async_1.auto(
        {
          createDBObject: [
            autoCallback => {
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
        (err, results) => {
          if (err) reject(err);
          resolve(results.createDBObject);
        },
      );
    });
  }
  toggleImageActive(id) {
    return this.ImageRepository.update({ id }, { isActive: false });
  }
  uploadTemplateBackground(id, uniqName, background) {
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
  uploadTemplate(id, uniqName, template) {
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
  uploadImageToS3(image, type, uniqName) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        aws_s3_utils_1
          .assumeS3Role(
            `${this.accountId}`,
            `${this.assumedRole}`,
            `s3-${type}-upload`,
            `${this.awsRegion}`,
            's3:*',
            `${this.bucketName}`,
          )
          .then(credentials => {
            const s3Uploader = new aws_sdk_1.S3({ credentials });
            const imageName =
              uniqName !== undefined ? `${uniqName}-${type}.png` : image.originalname;
            aws_s3_utils_1
              .putS3Object(
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
    });
  }
};
ImageService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(TemplateImage_entity_1.Image)),
    __metadata('design:paramtypes', [typeorm_2.Repository, AppConfig_service_1.AppConfigService]),
  ],
  ImageService,
);
exports.ImageService = ImageService;
//# sourceMappingURL=TemplateImage.service.js.map
