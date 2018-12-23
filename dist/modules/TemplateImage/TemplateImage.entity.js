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
const TemplateCategory_entity_1 = require('../TemplateCategory/TemplateCategory.entity');
const TemplateImageLayer_entity_1 = require('../TemplateImageLayer/TemplateImageLayer.entity');
let Image = class Image extends common_entity_1.CommonEntity {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  Image.prototype,
  'id',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'varchar',
      length: 64,
    }),
    __metadata('design:type', String),
  ],
  Image.prototype,
  'name',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'text',
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Image.prototype,
  'templateUrl',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'text',
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Image.prototype,
  'templateBackgroundUrl',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'boolean',
      default: true,
    }),
    __metadata('design:type', Boolean),
  ],
  Image.prototype,
  'isActive',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'boolean',
      default: false,
    }),
    __metadata('design:type', Boolean),
  ],
  Image.prototype,
  'isTrendingNow',
  void 0,
);
__decorate(
  [
    typeorm_1.ManyToOne(type => TemplateCategory_entity_1.Category, category => category.id),
    __metadata('design:type', TemplateCategory_entity_1.Category),
  ],
  Image.prototype,
  'category',
  void 0,
);
__decorate(
  [
    typeorm_1.OneToMany(type => TemplateImageLayer_entity_1.Layer, layer => layer.image),
    typeorm_1.JoinTable(),
    __metadata('design:type', Array),
  ],
  Image.prototype,
  'layers',
  void 0,
);
Image = __decorate([typeorm_1.Entity()], Image);
exports.Image = Image;
//# sourceMappingURL=TemplateImage.entity.js.map
