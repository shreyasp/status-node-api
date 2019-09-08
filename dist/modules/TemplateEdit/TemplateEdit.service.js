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
const axios_1 = require('axios');
const canvas_1 = require('canvas');
const fs_1 = require('fs');
const lodash_1 = require('lodash');
const moment = require('moment');
const path_1 = require('path');
const typeorm_2 = require('typeorm');
const url_1 = require('url');
const aws_s3_utils_1 = require('../../utils/aws-s3.utils');
const AppConfig_service_1 = require('../AppConfig/AppConfig.service');
const TemplateFont_entity_1 = require('../TemplateFont/TemplateFont.entity');
const TemplateImage_entity_1 = require('../TemplateImage/TemplateImage.entity');
const TemplateImageLayer_entity_1 = require('../TemplateImageLayer/TemplateImageLayer.entity');
let EditImageService = class EditImageService {
  constructor(LayerRepository, ImageRepository, FontRepository, config) {
    this.LayerRepository = LayerRepository;
    this.ImageRepository = ImageRepository;
    this.FontRepository = FontRepository;
    this.accountId = config.accountId;
    this.assumedRole = config.assumedRole;
    this.awsRegion = config.awsRegion;
    this.bucketName = config.bucketName;
  }
  registerTemplateFonts(uniqFonts, fontExtMap) {
    const basePath = path_1.join(__dirname, 'fonts');
    async_1.each(uniqFonts, fontName => {
      const fontObj = lodash_1.find(fontExtMap, f => f.path === fontName);
      canvas_1.registerFont(path_1.join(basePath, `${fontObj.path}` + `${fontObj.extension}`), {
        family: `${fontName}`,
      });
    });
  }
  placeTextLayers(id, layers, xPlacement, context) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((resolve, reject) => {
        const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
        queryBuilder
          .innerJoinAndSelect('Layer.font', 'font')
          .innerJoinAndSelect('Layer.style', 'style')
          .innerJoinAndSelect('Layer.frame', 'frame')
          .innerJoin('Layer.image', 'image')
          .where('image.id = :id', { id })
          .andWhere('type = :type', { type: 'text' })
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
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
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
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
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
      const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
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
        const filesToCleanUp = [];
        async_1.auto(
          {
            downloadImage: downloadImageCB => {
              const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
              queryBuilder
                .select('image.templateBackgroundUrl')
                .from(TemplateImage_entity_1.Image, 'image')
                .where('image.id = :id', { id })
                .getOne()
                .then(image => image.templateBackgroundUrl)
                .then(templateUrl => {
                  const dateString = moment().unix();
                  const imagePath = path_1.join(
                    __dirname,
                    'images',
                    `${dateString}-background.jpg`,
                  );
                  const axiosConfig = { responseType: 'arraybuffer' };
                  axios_1.default
                    .get(templateUrl, axiosConfig)
                    .then(response => new Buffer(response.data, 'binary'))
                    .then(data => {
                      fs_1.writeFile(imagePath, data, err => {
                        if (err) downloadImageCB(err);
                        filesToCleanUp.push(imagePath);
                        downloadImageCB(null, { imagePath });
                      });
                    })
                    .catch(err => downloadImageCB(err));
                })
                .catch(err => downloadImageCB(err));
            },
            downloadFonts: downloadFontsCB => {
              const queryBuilder = this.FontRepository.createQueryBuilder('Font');
              const axiosConfig = { responseType: 'arraybuffer' };
              this.getImageUniqFonts(id)
                .then(data => data.fonts)
                .then(fontNames => {
                  queryBuilder
                    .select('font.fontPath')
                    .from(TemplateFont_entity_1.Font, 'font')
                    .where('font.fontName IN (:...fontNames)', { fontNames })
                    .getMany()
                    .then(fontUrls => {
                      async_1.map(
                        fontUrls,
                        (fontUrl, cb) => {
                          const fontFile = path_1.parse(url_1.parse(fontUrl.fontPath).path).base;
                          const fontPath = path_1.join(__dirname, 'fonts', fontFile);
                          axios_1.default
                            .get(fontUrl.fontPath, axiosConfig)
                            .then(response => new Buffer(response.data, 'binary'))
                            .then(data => {
                              fs_1.writeFile(fontPath, data, err => {
                                if (err) downloadFontsCB(err);
                                filesToCleanUp.push(fontPath);
                                cb(null, {
                                  path: path_1.parse(url_1.parse(fontUrl.fontPath).path).name,
                                  extension: path_1.parse(url_1.parse(fontUrl.fontPath).path).ext,
                                });
                              });
                            })
                            .catch(err => downloadFontsCB(err));
                        },
                        (err, results) => {
                          if (err) downloadFontsCB(err);
                          downloadFontsCB(null, results);
                        },
                      );
                    })
                    .catch(err => downloadFontsCB(err));
                });
            },
            getCnvsCtxt: getCnvsCtxtCb => {
              this.getImageCanvasContext(id)
                .then(data => {
                  getCnvsCtxtCb(null, data);
                })
                .catch(err => getCnvsCtxtCb(err));
            },
            registerFonts: [
              'downloadFonts',
              (results, registerFontsCb) => {
                this.getImageUniqFonts(id)
                  .then(data => {
                    const fontExtMap = results.downloadFonts;
                    this.registerTemplateFonts(data.fonts, fontExtMap);
                    registerFontsCb(null, { success: true });
                  })
                  .catch(err => {
                    registerFontsCb(err);
                  });
              },
            ],
            imageManipulation: [
              'downloadImage',
              'getCnvsCtxt',
              'registerFonts',
              (results, imgManipCb) => {
                const context = results.getCnvsCtxt.context;
                const canvas = results.getCnvsCtxt.canvas;
                const imageFrame = results.getCnvsCtxt.imageFrame;
                canvas_1.loadImage(results.downloadImage.imagePath).then(image => {
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
                      const dateString = moment().unix();
                      const imagePath = path_1.join(
                        __dirname,
                        'images',
                        `${dateString}-edited.jpg`,
                      );
                      const oStream = fs_1.createWriteStream(imagePath);
                      const jpegStream = canvas.createJPEGStream({
                        compression: 95,
                        progressive: true,
                      });
                      jpegStream.pipe(oStream);
                      oStream.on('finish', () => {
                        filesToCleanUp.push(imagePath);
                        imgManipCb(null, { imagePath });
                      });
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
                async_1.every(
                  filesToCleanUp,
                  (filePath, cb) => {
                    fs_1.unlink(filePath, err => cb(null, true));
                  },
                  (err, result) => {
                    if (err) cleanUpManipImgCB(err);
                    cleanUpManipImgCB(null, { success: result });
                  },
                );
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
            `${this.accountId}`,
            `${this.assumedRole}`,
            'S3-Upload-Session',
            `${this.awsRegion}`,
            's3:*',
            `${this.bucketName}`,
          )
          .then(credentials => {
            const parsedPath = path_1.parse(imagePath);
            const s3Uploader = new aws_sdk_1.S3({ credentials });
            aws_s3_utils_1
              .putS3Object(
                s3Uploader,
                `${this.awsRegion}`,
                `${this.bucketName}`,
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
    __param(1, typeorm_1.InjectRepository(TemplateImage_entity_1.Image)),
    __param(2, typeorm_1.InjectRepository(TemplateFont_entity_1.Font)),
    __metadata('design:paramtypes', [
      typeorm_2.Repository,
      typeorm_2.Repository,
      typeorm_2.Repository,
      AppConfig_service_1.AppConfigService,
    ]),
  ],
  EditImageService,
);
exports.EditImageService = EditImageService;
//# sourceMappingURL=TemplateEdit.service.js.map
