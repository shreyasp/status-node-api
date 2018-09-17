import { Injectable } from '@nestjs/common';
import { each as asyncEach } from 'async';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { createWriteStream } from 'fs';
import { get, map, pickBy, uniq } from 'lodash';
import { join } from 'path';

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
  constructor() {}

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

          context.font = `${font.fontSize}px ${layer.font.fontName}`;
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

  async editImage(imageMetadata: Partial<TemplateLayerNameObj>): Promise<any> {
    const imageFrame: IFrame = get(imageMetadata, 'image.frame');
    const canvas = createCanvas(imageFrame.width, imageFrame.height);
    const context = canvas.getContext('2d');

    /* Get all the unique fonts used in the Tenplate */
    const uniqFonts: string[] = uniq(
      map(pickBy(imageMetadata, (o: ILayer) => o.type === 'text'), (v: ILayer) => v.font.fontName),
    );

    /* Register Fonts required by the template */
    this.registerTemplateFonts(uniqFonts);

    /* Get the image and createCanvas for it */
    return new Promise((resolve, reject) => {
      loadImage(__dirname + '/images/Image.png').then(image => {
        context.drawImage(image, imageFrame.x, imageFrame.y, imageFrame.width, imageFrame.height);

        const xPlacement = imageFrame.width / 2;
        return this.placeTextLayers(imageMetadata, xPlacement, context)
          .then(() => {
            const oStream = createWriteStream(__dirname + '/images/edited.png');
            const pngStream = canvas.createPNGStream();
            pngStream.pipe(oStream);
            oStream.on('finish', () =>
              resolve({ success: true, message: 'Image created successfully' }),
            );
          })
          .catch(err => reject(err));
      });
    });
  }
}

export { EditImageService };
