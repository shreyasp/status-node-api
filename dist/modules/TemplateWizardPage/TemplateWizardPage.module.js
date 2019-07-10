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
const TemplateWizardPage_entity_1 = require('./TemplateWizardPage.entity');
const TemplateWizardPage_service_1 = require('./TemplateWizardPage.service');
const TemplateWizardPage_controller_1 = require('./TemplateWizardPage.controller');
const LayerMaster_entity_1 = require('../TemplateImageLayer/LayerMaster.entity');
let WizardPageModule = class WizardPageModule {};
WizardPageModule = __decorate(
  [
    common_1.Module({
      imports: [
        typeorm_1.TypeOrmModule.forFeature([
          LayerMaster_entity_1.LayerMaster,
          TemplateWizardPage_entity_1.WizardPage,
        ]),
      ],
      controllers: [TemplateWizardPage_controller_1.WizardPageController],
      providers: [TemplateWizardPage_service_1.WizardPageService],
    }),
  ],
  WizardPageModule,
);
exports.WizardPageModule = WizardPageModule;
//# sourceMappingURL=TemplateWizardPage.module.js.map
