import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResultCallback, auto as asyncAuto, each as asyncEach, map as asyncMap } from 'async';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { createWriteStream, unlinkSync, writeFile } from 'fs';
import { get, map, merge, uniq } from 'lodash';
import * as moment from 'moment';
import { join, parse } from 'path';
import { DeepPartial, Repository } from 'typeorm';
import { parse as urlParse } from 'url';

import { assumeS3Role, putS3Object } from '../../utils/aws-s3.utils';
import { AppConfigService } from '../AppConfig/AppConfig.service';
import { Font } from '../TemplateFont/TemplateFont.entity';
import { Image } from '../TemplateImage/TemplateImage.entity';
import { Layer } from '../TemplateImageLayer/TemplateImageLayer.entity';

interface IFont {
  fontName: string;
  fontSize: number;
}

interface IFrame {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface IStyle {
  color: string;
  opacity: number;
}

interface ILayer {
  alignment: string;
  font: IFont;
  frame: IFrame;
  layerParent: string;
  style: IStyle;
  text: string | Date;
  type: 'text' | 'image';
}

interface TemplateLayerNameObj {
  image: ILayer;
  note_header_text: ILayer;
  ocaasion_category: ILayer;
  occasion_description_line_1: ILayer;
  occasion_description_line_2: ILayer;
  occasion_description_line_3: ILayer;
  person_1: ILayer;
  ocaasion_type: ILayer;
  person_2: ILayer;
  date: ILayer;
  time: ILayer;
  main_address: ILayer;
  address_line_1: ILayer;
  address_line_2: ILayer;
  address_type: ILayer;
}

@Injectable()
class EditImageService {
  constructor(
    @InjectRepository(Layer) private readonly LayerRepository: Repository<Layer>,
    @InjectRepository(Image) private readonly ImageRepository: Repository<Image>,
    @InjectRepository(Font) private readonly FontRepository: Repository<Font>,
  ) {}

  config = new AppConfigService().readAppConfig();

  registerTemplateFonts(uniqFonts: string[]) {
    // TODO: Establish a base path where all the uploaded fonts will be stored
    const basePath: string = join(__dirname, 'fonts');
    asyncEach(uniqFonts, (fontName: string) => {
      registerFont(join(basePath, `${fontName}.ttf`), { family: `${fontName}` });
    });
  }

  async placeTextLayers(
    id: DeepPartial<Layer>,
    layers: Partial<TemplateLayerNameObj>,
    xPlacement: number,
    context: any,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
      queryBuilder
        .innerJoinAndSelect('Layer.font', 'font')
        .innerJoinAndSelect('Layer.style', 'style')
        .innerJoinAndSelect('Layer.frame', 'frame')
        .innerJoin('Layer.image', 'image')
        .where('image.id = :id', { id })
        .where('type = :type', { type: 'text' })
        .getMany()
        .then(fetchedLayers => {
          map(fetchedLayers, fetchedLayer => {
            const editedLayer = get(layers, `${fetchedLayer.name}`);
            const mergedLayer = merge(fetchedLayer, editedLayer);
            const font: DeepPartial<IFont> = fetchedLayer.font;

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
  }

  getImageCanvasContext(id: DeepPartial<Layer>): Promise<any> {
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
    return new Promise((resolve, reject) => {
      queryBuilder
        .innerJoinAndSelect('Layer.frame', 'frame')
        .innerJoin('Layer.image', 'image')
        .where('image.id = :id', { id })
        .andWhere('type = :type', { type: 'image' })
        .getOne()
        .then(layer => {
          const imageFrame: DeepPartial<IFrame> = get(layer, 'frame');
          const canvas = createCanvas(imageFrame.width, imageFrame.height);
          const context = canvas.getContext('2d');
          resolve({ context, canvas, imageFrame });
        })
        .catch(err => reject(err));
    });
  }

  getImageUniqFonts(id: DeepPartial<Layer>): Promise<any> {
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
    return new Promise((resolve, reject) => {
      queryBuilder
        .innerJoinAndSelect('Layer.font', 'font')
        .innerJoin('Layer.image', 'image')
        .where('image.id = :id', { id })
        .andWhere('type = :type', { type: 'text' })
        .getMany()
        .then(layers => {
          resolve({ fonts: uniq(map(layers, layer => layer.font.fontName)) });
        })
        .catch(err => reject(err));
    });
  }

  async getRelatedImageFromLayer(id): Promise<any> {
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
    return new Promise((resolve, reject) => {
      queryBuilder
        .innerJoinAndSelect('Layer.image', 'image')
        .where('image.id = :id', { id })
        .getOne()
        .then(layer => resolve(layer.image))
        .catch(err => reject(err));
    });
  }

  async editImage(
    id: DeepPartial<Layer>,
    imageMetadata: Partial<TemplateLayerNameObj>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const filesToCleanUp: string[] = [];
      asyncAuto(
        {
          downloadImage: (downloadImageCB: AsyncResultCallback<{}, {}>) => {
            const queryBuilder = this.ImageRepository.createQueryBuilder('Image');
            queryBuilder
              .select('image.templateBackgroundUrl')
              .from(Image, 'image')
              .where('image.id = :id', { id })
              .getOne()
              .then(image => image.templateBackgroundUrl)
              .then(templateUrl => {
                const dateString = moment().unix();
                const imagePath = join(__dirname, 'images', `${dateString}-background.png`);
                const axiosConfig = { responseType: 'arraybuffer' };

                axios
                  .get(templateUrl, axiosConfig)
                  .then(response => new Buffer(response.data, 'binary'))
                  .then(data => {
                    writeFile(imagePath, data, err => {
                      if (err) downloadImageCB(err);
                      filesToCleanUp.push(imagePath);
                      downloadImageCB(null, { imagePath });
                    });
                  })
                  .catch(err => downloadImageCB(err));
              })
              .catch(err => downloadImageCB(err));
          },
          downloadFonts: (downloadFontsCB: AsyncResultCallback<{}, {}>) => {
            const queryBuilder = this.FontRepository.createQueryBuilder('Font');
            const axiosConfig = { responseType: 'arraybuffer' };

            this.getImageUniqFonts(id)
              .then(data => data.fonts)
              .then(fontNames => {
                queryBuilder
                  .select('font.fontPath')
                  .from(Font, 'font')
                  .where('font.fontName IN (:...fontNames)', { fontNames })
                  .getMany()
                  .then(fontUrls => {
                    asyncMap(
                      fontUrls,
                      (fontUrl, cb) => {
                        const fontFile = parse(urlParse(fontUrl.fontPath).path).base;
                        const fontPath = join(__dirname, 'fonts', fontFile);

                        axios
                          .get(fontUrl.fontPath, axiosConfig)
                          .then(response => new Buffer(response.data, 'binary'))
                          .then(data => {
                            writeFile(fontPath, data, err => {
                              if (err) downloadFontsCB(err);
                              filesToCleanUp.push(fontPath);
                              cb(null, fontPath);
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
          getCnvsCtxt: (getCnvsCtxtCb: AsyncResultCallback<{}, {}>) => {
            this.getImageCanvasContext(id)
              .then(data => {
                getCnvsCtxtCb(null, data);
              })
              .catch(err => getCnvsCtxtCb(err));
          },
          registerFonts: [
            'downloadFonts',
            (results: any, registerFontsCb: AsyncResultCallback<{}, {}>) => {
              this.getImageUniqFonts(id)
                .then(data => {
                  this.registerTemplateFonts(data.fonts);
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
            (results: any, imgManipCb: AsyncResultCallback<{}, {}>) => {
              const context = results.getCnvsCtxt.context;
              const canvas = results.getCnvsCtxt.canvas;
              const imageFrame = results.getCnvsCtxt.imageFrame;

              loadImage(results.downloadImage.imagePath).then(image => {
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
                    const imagePath = join(__dirname, 'images', `${dateString}-edited.png`);
                    const oStream = createWriteStream(imagePath);
                    const pngStream = canvas.createPNGStream();
                    pngStream.pipe(oStream);
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
            (results: any, uploadManipCb: AsyncResultCallback<{}, {}>) => {
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
          // cleanUpManipImage: [
          //   'uploadManipImage',
          //   (results: any, cleanUpManipImgCB: AsyncResultCallback<{}, {}>) => {
          //     asyncEach(
          //       filesToCleanUp,
          //       filePath => {
          //         try {
          //           unlinkSync(filePath);
          //         } catch (err) {
          //           throw new Error(err);
          //         }

          //         cleanUpManipImgCB(null, {
          //           success: true,
          //           message: 'Images cleaned up successfully',
          //         });
          //       },
          //       err => {
          //         if (err) cleanUpManipImgCB(err);
          //       },
          //     );
          //   },
          // ],
        },
        Infinity,
        (err, results) => {
          if (err) reject(err);
          console.log(filesToCleanUp);
          resolve(results.uploadManipImage);
        },
      );
    });
  }

  async uploadImageToS3(imagePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      assumeS3Role(
        `${this.config.accountId}`,
        `${this.config.assumedRole}`,
        'S3-Upload-Session',
        `${this.config.awsRegion}`,
        's3:*',
        `${this.config.bucketName}`,
      )
        .then(credentials => {
          const parsedPath = parse(imagePath);
          const s3Uploader: S3 = new S3({ credentials });
          putS3Object(
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
  }

  // async getObjectFromS3(imageUrl: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     assumeS3Role(
  //       '369329776707',
  //       'Test',
  //       'S3-Download-Session',
  //       'ap-south-1',
  //       's3:GetObject',
  //       'test-sts-role-bucket',
  //     )
  //       .then(credentials => {
  //         const s3Uploader: S3 = new S3({ credentials });
  //         getS3Object(s3Uploader, imageUrl)
  //           .then(data => resolve(data))
  //           .catch(err => reject(err));
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         reject(err);
  //       });
  //   });
  // }
}

export { EditImageService };
