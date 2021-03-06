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
const AppConfig_module_1 = require('../AppConfig/AppConfig.module');
const TemplateImage_controller_1 = require('./TemplateImage.controller');
const TemplateImage_entity_1 = require('./TemplateImage.entity');
const TemplateImage_service_1 = require('./TemplateImage.service');
const TemplateWizardPage_entity_1 = require('../TemplateWizardPage/TemplateWizardPage.entity');
let TemplateImageModule = class TemplateImageModule {};
TemplateImageModule = __decorate(
  [
    common_1.Module({
      imports: [
        typeorm_1.TypeOrmModule.forFeature([
          TemplateImage_entity_1.Image,
          TemplateWizardPage_entity_1.WizardPage,
        ]),
        AppConfig_module_1.AppConfigModule,
      ],
      controllers: [TemplateImage_controller_1.ImageController],
      providers: [TemplateImage_service_1.ImageService],
    }),
  ],
  TemplateImageModule,
);
exports.TemplateImageModule = TemplateImageModule;
//# sourceMappingURL=TemplateImage.module.js.map
