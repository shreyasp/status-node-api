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
Object.defineProperty(exports, '__esModule', { value: true });
const typeorm_1 = require('typeorm');
const common_entity_1 = require('../../entities/common.entity');
const TemplateImage_entity_1 = require('../TemplateImage/TemplateImage.entity');
let LayerStyle = class LayerStyle {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  LayerStyle.prototype,
  'styleId',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  LayerStyle.prototype,
  'color',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      nullable: true,
    }),
    __metadata('design:type', Number),
  ],
  LayerStyle.prototype,
  'opacity',
  void 0,
);
LayerStyle = __decorate([typeorm_1.Entity()], LayerStyle);
exports.LayerStyle = LayerStyle;
let LayerFrame = class LayerFrame {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  LayerFrame.prototype,
  'frameId',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'float',
      default: 0.0,
    }),
    __metadata('design:type', Number),
  ],
  LayerFrame.prototype,
  'height',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'float',
      default: 0.0,
    }),
    __metadata('design:type', Number),
  ],
  LayerFrame.prototype,
  'width',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'float',
      default: 0.0,
    }),
    __metadata('design:type', Number),
  ],
  LayerFrame.prototype,
  'x',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'float',
      default: 0.0,
    }),
    __metadata('design:type', Number),
  ],
  LayerFrame.prototype,
  'y',
  void 0,
);
LayerFrame = __decorate([typeorm_1.Entity()], LayerFrame);
exports.LayerFrame = LayerFrame;
let LayerFont = class LayerFont {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  LayerFont.prototype,
  'fontId',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  LayerFont.prototype,
  'fontName',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      nullable: true,
      type: 'float',
    }),
    __metadata('design:type', Number),
  ],
  LayerFont.prototype,
  'fontSize',
  void 0,
);
LayerFont = __decorate([typeorm_1.Entity()], LayerFont);
exports.LayerFont = LayerFont;
let Layer = class Layer extends common_entity_1.CommonEntity {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  Layer.prototype,
  'layerId',
  void 0,
);
__decorate(
  [typeorm_1.Column(), __metadata('design:type', String)],
  Layer.prototype,
  'name',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Layer.prototype,
  'alignment',
  void 0,
);
__decorate(
  [typeorm_1.Column(), __metadata('design:type', String)],
  Layer.prototype,
  'layerParent',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Layer.prototype,
  'text',
  void 0,
);
__decorate(
  [typeorm_1.Column(), __metadata('design:type', String)],
  Layer.prototype,
  'type',
  void 0,
);
__decorate(
  [typeorm_1.Column(), __metadata('design:type', Boolean)],
  Layer.prototype,
  'isActive',
  void 0,
);
__decorate(
  [
    typeorm_1.OneToOne(type => LayerStyle, {
      cascade: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata('design:type', LayerStyle),
  ],
  Layer.prototype,
  'style',
  void 0,
);
__decorate(
  [
    typeorm_1.OneToOne(type => LayerFont, {
      cascade: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata('design:type', LayerFont),
  ],
  Layer.prototype,
  'font',
  void 0,
);
__decorate(
  [
    typeorm_1.OneToOne(type => LayerFrame, {
      cascade: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata('design:type', LayerFrame),
  ],
  Layer.prototype,
  'frame',
  void 0,
);
__decorate(
  [
    typeorm_1.ManyToOne(type => TemplateImage_entity_1.Image, image => image.layers),
    __metadata('design:type', TemplateImage_entity_1.Image),
  ],
  Layer.prototype,
  'image',
  void 0,
);
__decorate(
  [typeorm_1.Column(), __metadata('design:type', Number)],
  Layer.prototype,
  'layerMasterId',
  void 0,
);
Layer = __decorate([typeorm_1.Entity()], Layer);
exports.Layer = Layer;
//# sourceMappingURL=TemplateImageLayer.entity.js.map
