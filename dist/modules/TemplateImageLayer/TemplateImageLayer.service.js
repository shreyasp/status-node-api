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
Object.defineProperty(exports, '__esModule', { value: true });
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const async_1 = require('async');
const lodash_1 = require('lodash');
const typeorm_2 = require('typeorm');
const TemplateImageLayer_entity_1 = require('./TemplateImageLayer.entity');
let LayerService = class LayerService {
  constructor(LayerRepository) {
    this.LayerRepository = LayerRepository;
  }
  getImageRelatedLayers(id) {
    const queryBuilder = this.LayerRepository.createQueryBuilder('Layer');
    return queryBuilder
      .innerJoinAndSelect('Layer.font', 'font')
      .innerJoinAndSelect('Layer.style', 'style')
      .innerJoinAndSelect('Layer.frame', 'frame')
      .innerJoin('Layer.image', 'image')
      .where('image.id = :id', { id })
      .getMany()
      .then(layers => {
        if (lodash_1.isEmpty(layers)) {
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
  createUpdateTemplateLayers(imageId, layers) {
    return new Promise((resolve, reject) => {
      async_1.eachOf(
        layers,
        (layer, layerName, cb) => {
          this.LayerRepository.save(
            Object.assign({}, layer, { name: layerName, image: imageId, isActive: true }),
          ).catch(err => cb(err));
          cb(null);
        },
        err => {
          if (err) reject(err);
          resolve(true);
        },
      );
    });
  }
};
LayerService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(TemplateImageLayer_entity_1.Layer)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  LayerService,
);
exports.LayerService = LayerService;
//# sourceMappingURL=TemplateImageLayer.service.js.map
