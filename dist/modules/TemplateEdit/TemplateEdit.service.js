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
const canvas_1 = require('canvas');
const fs_1 = require('fs');
const lodash_1 = require('lodash');
const path_1 = require('path');
const typeorm_2 = require('typeorm');
const aws_s3_utils_1 = require('../../utils/aws-s3.utils');
const AppConfig_service_1 = require('../AppConfig/AppConfig.service');
const TemplateImageLayer_entity_1 = require('../TemplateImageLayer/TemplateImageLayer.entity');
let EditImageService = class EditImageService {
  constructor(ImageRepository) {
    this.ImageRepository = ImageRepository;
    this.config = new AppConfig_service_1.AppConfigService().readAppConfig();
  }
  registerTemplateFonts(uniqFonts) {
    const basePath = path_1.join(__dirname, 'fonts');
    async_1.each(uniqFonts, fontName => {
      canvas_1.registerFont(path_1.join(basePath, `${fontName}.ttf`), { family: `${fontName}` });
    });
  }
  placeTextLayers(id, layers, xPlacement, context) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        const queryBuilder = this.ImageRepository.createQueryBuilder('Layer');
        queryBuilder
          .innerJoinAndSelect('Layer.font', 'font')
          .innerJoinAndSelect('Layer.style', 'style')
          .innerJoinAndSelect('Layer.frame', 'frame')
          .innerJoin('Layer.image', 'image')
          .where('image.id = :id', { id })
          .where('type = :type', { type: 'text' })
          .getMany()
          .then(fetchedLayers => {
            lodash_1.map(fetchedLayers, fetchedLayer => {
              const editedLayer = lodash_1.get(layers, `${fetchedLayer.name}`);
              const mergedLayer = lodash_1.merge(fetchedLayer, editedLayer);
              const font = fetchedLayer.font;
              context.font = `${font.fontSize}px ${font.fontName}`;
              context.fillStyle = fetchedLayer.style.color;
              context.textBaseline = 'top';
              context.textAlign = fetchedLayer.alignment;
              try {
                context.fillText(mergedLayer.text, xPlacement, mergedLayer.frame.y);
              } catch (err) {
                reject(err);
              }
            });
            resolve(true);
          })
          .catch(err => reject(err));
      });
    });
  }
  getImageCanvasContext(id) {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Layer');
    return new Promise((resolve, reject) => {
      queryBuilder
        .innerJoinAndSelect('Layer.frame', 'frame')
        .innerJoin('Layer.image', 'image')
        .where('image.id = :id', { id })
        .andWhere('type = :type', { type: 'image' })
        .getOne()
        .then(layer => {
          const imageFrame = lodash_1.get(layer, 'frame');
          const canvas = canvas_1.createCanvas(imageFrame.width, imageFrame.height);
          const context = canvas.getContext('2d');
          resolve({ context, canvas, imageFrame });
        })
        .catch(err => reject(err));
    });
  }
  getImageUniqFonts(id) {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Layer');
    return new Promise((resolve, reject) => {
      queryBuilder
        .innerJoinAndSelect('Layer.font', 'font')
        .innerJoin('Layer.image', 'image')
        .where('image.id = :id', { id })
        .andWhere('type = :type', { type: 'text' })
        .getMany()
        .then(layers => {
          resolve({ fonts: lodash_1.uniq(lodash_1.map(layers, layer => layer.font.fontName)) });
        })
        .catch(err => reject(err));
    });
  }
  getRelatedImageFromLayer(id) {
    return __awaiter(this, void 0, void 0, function*() {
      const queryBuilder = this.ImageRepository.createQueryBuilder('Layer');
      return new Promise((resolve, reject) => {
        queryBuilder
          .innerJoinAndSelect('Layer.image', 'image')
          .where('image.id = :id', { id })
          .getOne()
          .then(layer => resolve(layer.image))
          .catch(err => reject(err));
      });
    });
  }
  editImage(id, imageMetadata) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        async_1.auto(
          {
            getCnvsCtxt: getCnvsCtxtCb => {
              this.getImageCanvasContext(id)
                .then(data => {
                  getCnvsCtxtCb(null, data);
                })
                .catch(err => getCnvsCtxtCb(err));
            },
            registerFonts: registerFontsCb => {
              this.getImageUniqFonts(id)
                .then(data => {
                  this.registerTemplateFonts(data.fonts);
                  registerFontsCb(null, { success: true });
                })
                .catch(err => {
                  registerFontsCb(err);
                });
            },
            imageManipulation: [
              'getCnvsCtxt',
              'registerFonts',
              (results, imgManipCb) => {
                const context = results.getCnvsCtxt.context;
                const canvas = results.getCnvsCtxt.canvas;
                const imageFrame = results.getCnvsCtxt.imageFrame;
                const templateBkgndPath = path_1.join(__dirname + '/images/Image.png');
                canvas_1.loadImage(templateBkgndPath).then(image => {
                  context.drawImage(
                    image,
                    imageFrame.x,
                    imageFrame.y,
                    imageFrame.width,
                    imageFrame.height,
                  );
                  const xPlacement = imageFrame.width / 2;
                  return this.placeTextLayers(id, imageMetadata, xPlacement, context)
                    .then(() => {
                      const imagePath = path_1.join(__dirname, 'images', 'edited.png');
                      const oStream = fs_1.createWriteStream(imagePath);
                      const pngStream = canvas.createPNGStream();
                      pngStream.pipe(oStream);
                      oStream.on('finish', () => imgManipCb(null, { imagePath }));
                    })
                    .catch(err => imgManipCb(err));
                });
              },
            ],
            uploadManipImage: [
              'imageManipulation',
              (results, uploadManipCb) => {
                const editedImgPath = results.imageManipulation.imagePath;
                this.uploadImageToS3(editedImgPath)
                  .then(data =>
                    uploadManipCb(null, {
                      success: true,
                      message: 'Image created successfully',
                      data,
                    }),
                  )
                  .catch(err => uploadManipCb(err));
              },
            ],
            cleanUpManipImage: [
              'uploadManipImage',
              (results, cleanUpManipImgCB) => {
                fs_1.unlink(results.imageManipulation.imagePath, err => {
                  if (err) cleanUpManipImgCB(err);
                  cleanUpManipImgCB(null, {
                    success: true,
                    message: 'Image cleaned up successfully',
                  });
                });
              },
            ],
          },
          Infinity,
          (err, results) => {
            if (err) reject(err);
            resolve(results.uploadManipImage);
          },
        );
      });
    });
  }
  uploadImageToS3(imagePath) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        aws_s3_utils_1
          .assumeS3Role(
            `${this.config.accountId}`,
            `${this.config.assumedRole}`,
            'S3-Upload-Session',
            `${this.config.awsRegion}`,
            's3:*',
            `${this.config.bucketName}`,
          )
          .then(credentials => {
            const parsedPath = path_1.parse(imagePath);
            const s3Uploader = new aws_sdk_1.S3({ credentials });
            aws_s3_utils_1
              .putS3Object(
                s3Uploader,
                `${this.config.awsRegion}`,
                `${this.config.bucketName}`,
                `images/${parsedPath.base}`,
                imagePath,
              )
              .then(data => resolve(data))
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      });
    });
  }
};
EditImageService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(TemplateImageLayer_entity_1.Layer)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  EditImageService,
);
exports.EditImageService = EditImageService;
//# sourceMappingURL=TemplateEdit.service.js.map
