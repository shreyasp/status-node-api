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
Object.defineProperty(exports, '__esModule', { value: true });
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const TemplateCategory_service_1 = require('./TemplateCategory.service');
const TemplateCategory_controller_1 = require('./TemplateCategory.controller');
const TemplateCategory_entity_1 = require('./TemplateCategory.entity');
let TemplateCategoryModule = class TemplateCategoryModule {};
TemplateCategoryModule = __decorate(
  [
    common_1.Module({
      imports: [typeorm_1.TypeOrmModule.forFeature([TemplateCategory_entity_1.Category])],
      controllers: [TemplateCategory_controller_1.CategoryController],
      providers: [TemplateCategory_service_1.CategoryService],
    }),
  ],
  TemplateCategoryModule,
);
exports.TemplateCategoryModule = TemplateCategoryModule;
//# sourceMappingURL=TemplateCategory.module.js.map
