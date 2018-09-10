import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { createWriteStream } from 'fs';
import { forEach, get, map, pickBy, split, uniq } from 'lodash';
import { join } from 'path';
import { Repository } from 'typeorm';

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

  registerFont(uniqFonts: string[]) {
    const basePath: string = join(__dirname, 'fonts');

    forEach(uniqFonts, (font: string) => {
      const _font_fam_wt: string[] = split(font, '-');
      registerFont(
        join(basePath, `${font}.ttf`),
        { family: _font_fam_wt[0] },
        { weight: _font_fam_wt[1] },
      );
    });
  }

  editImage(imageMetadata: Partial<TemplateLayerNameObj>) {
    const imageFrame: IFrame = get(imageMetadata, 'image.frame');
    const canvas = createCanvas(imageFrame.width, imageFrame.height);
    const context = canvas.getContext('2d');

    // Get all the unique fonts used in the Tenplate
    const uniqFonts: string[] = uniq(
      map(
        pickBy(imageMetadata, (o: ILayer) => o.type === 'text'),
        (v: ILayer) => v.font.fontName,
      ),
    );

    this.registerFont(uniqFonts);

    /* Step - 1: Get the image and createCanvas for it */
    // const noteHeader: ILayer = get(imageMetadata, 'note_header_text');
    // loadImage(__dirname + '/image/Image.png').then(image => {
    //   context.drawImage(
    //     image,
    //     imageFrame.x,
    //     imageFrame.y,
    //     imageFrame.width,
    //     imageFrame.height,
    //   );
    //   const oStream = createWriteStream(__dirname + '/image/edited.png');
    //   const pngStream = canvas.createPNGStream();
    //   pngStream.pipe(oStream);
    //   oStream.on('finish', () => console.log('New Image Created'));
    // });
  }
}

export { EditImageService };
