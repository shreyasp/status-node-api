import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncResultCallback, auto as asyncAuto, each as asyncEach } from 'async';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { createWriteStream } from 'fs';
import { get, map, uniq } from 'lodash';
import { join } from 'path';
import { DeepPartial, Repository } from 'typeorm';

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
  constructor(@InjectRepository(Layer) private readonly ImageRepository: Repository<Layer>) {}

  registerTemplateFonts(uniqFonts: string[]) {
    const basePath: string = join(__dirname, 'fonts');
    asyncEach(uniqFonts, (fontName: string) => {
      registerFont(join(basePath, `${fontName}.ttf`), { family: `${fontName}` });
    });
  }

  async placeTextLayers(
    layers: Partial<TemplateLayerNameObj>,
    xPlacement: number,
    context: any,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncEach(layers, layer => {
        if (layer.type !== 'image') {
          const font: IFont = layer.font;

          context.font = `${font.fontSize}px ${font.fontName}`;
          context.fillStyle = layer.style.color;
          context.textBaseline = 'top';
          context.textAlign = layer.alignment;

          try {
            context.fillText(layer.text, xPlacement, layer.frame.y);
          } catch (err) {
            reject(err);
          }
        }
      });
      resolve(true);
    });
  }

  getImageCanvasContext(id: DeepPartial<Layer>): Promise<any> {
    const queryBuilder = this.ImageRepository.createQueryBuilder('Layer');
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
    const queryBuilder = this.ImageRepository.createQueryBuilder('Layer');
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

  async editImage(
    id: DeepPartial<Layer>,
    imageMetadata: Partial<TemplateLayerNameObj>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      asyncAuto(
        {
          getCnvsCtxt: (getCnvsCtxtCb: AsyncResultCallback<{}, {}>) => {
            this.getImageCanvasContext(id)
              .then(data => {
                getCnvsCtxtCb(null, data);
              })
              .catch(err => getCnvsCtxtCb(err));
          },
          registerFonts: [
            'getCnvsCtxt',
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
            'getCnvsCtxt',
            'registerFonts',
            (results: any, imgManipCb: AsyncResultCallback<{}, {}>) => {
              const context = results.getCnvsCtxt.context;
              const canvas = results.getCnvsCtxt.canvas;
              const imageFrame = results.getCnvsCtxt.imageFrame;

              loadImage(__dirname + '/images/Image.png').then(image => {
                context.drawImage(
                  image,
                  imageFrame.x,
                  imageFrame.y,
                  imageFrame.width,
                  imageFrame.height,
                );

                const xPlacement = imageFrame.width / 2;
                return this.placeTextLayers(imageMetadata, xPlacement, context)
                  .then(() => {
                    const oStream = createWriteStream(__dirname + '/images/edited.png');
                    const pngStream = canvas.createPNGStream();
                    pngStream.pipe(oStream);
                    oStream.on('finish', () =>
                      imgManipCb(null, { success: true, message: 'Image created successfully' }),
                    );
                  })
                  .catch(err => imgManipCb(err));
              });
            },
          ],
        },
        Infinity,
        (err, results) => {
          if (err) reject(err);
          resolve(results.imageManipulation);
        },
      );
    });
  }
}

export { EditImageService };
