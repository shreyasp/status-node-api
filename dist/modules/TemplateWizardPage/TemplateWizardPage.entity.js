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
const LayerMaster_entity_1 = require('../TemplateImageLayer/LayerMaster.entity');
let WizardPage = class WizardPage extends common_entity_1.CommonEntity {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  WizardPage.prototype,
  'pageId',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'varchar',
      length: 127,
    }),
    __metadata('design:type', String),
  ],
  WizardPage.prototype,
  'pageTitle',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'bigint',
    }),
    __metadata('design:type', Number),
  ],
  WizardPage.prototype,
  'pageNumber',
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
  WizardPage.prototype,
  'isActive',
  void 0,
);
__decorate(
  [
    typeorm_1.ManyToOne(type => TemplateCategory_entity_1.Category, category => category.id),
    __metadata('design:type', TemplateCategory_entity_1.Category),
  ],
  WizardPage.prototype,
  'category',
  void 0,
);
__decorate(
  [
    typeorm_1.ManyToMany(type => LayerMaster_entity_1.LayerMaster),
    typeorm_1.JoinTable(),
    __metadata('design:type', Array),
  ],
  WizardPage.prototype,
  'layerMasters',
  void 0,
);
WizardPage = __decorate([typeorm_1.Entity()], WizardPage);
exports.WizardPage = WizardPage;
//# sourceMappingURL=TemplateWizardPage.entity.js.map
