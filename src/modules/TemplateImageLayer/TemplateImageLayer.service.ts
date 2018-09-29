import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { eachOf as asyncEachOf } from 'async';
import { isEmpty } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';

import { Image } from '../TemplateImage/TemplateImage.entity';
import { Layer } from './TemplateImageLayer.entity';

@Injectable()
class LayerService {
  constructor(@InjectRepository(Layer) private readonly LayerRepository: Repository<Layer>) {}

  getImageRelatedLayers(id: DeepPartial<Image>) {
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
    return queryBuilder
      .innerJoinAndSelect('Layer.font', 'font')
      .innerJoinAndSelect('Layer.style', 'style')
      .innerJoinAndSelect('Layer.frame', 'frame')
      .innerJoin('Layer.image', 'image')
      .where('image.id = :id', { id })
      .getMany()
      .then(layers => {
        if (isEmpty(layers)) {
          return {
            success: true,
            message: `No layer with imageId:${id} found in the database`,
            data: layers,
          };
        }

        return {
          success: true,
          message: `Layers for image fetched successfully`,
          data: layers,
        };
      })
      .catch(err => err);
  }

  createUpdateTemplateLayers(imageId: DeepPartial<Image>, layers: any) {
    return new Promise((resolve, reject) => {
      asyncEachOf(
        layers,
        (layer: DeepPartial<Layer>, layerName: string, cb) => {
          this.LayerRepository.save({
            ...layer,
            name: layerName,
            image: imageId,
            isActive: true,
          }).catch(err => cb(err));
          cb(null);
        },
        err => {
          if (err) reject(err);
          resolve(true);
        },
      );
    });
  }
}

export { LayerService };
