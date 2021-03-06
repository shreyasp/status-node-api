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
const TemplateFont_entity_1 = require('../TemplateFont/TemplateFont.entity');
const TemplateImage_entity_1 = require('../TemplateImage/TemplateImage.entity');
const TemplateImageLayer_entity_1 = require('../TemplateImageLayer/TemplateImageLayer.entity');
const TemplateEdit_controller_1 = require('./TemplateEdit.controller');
const TemplateEdit_service_1 = require('./TemplateEdit.service');
let EditImageModule = class EditImageModule {};
EditImageModule = __decorate(
  [
    common_1.Module({
      imports: [
        typeorm_1.TypeOrmModule.forFeature([
          TemplateImageLayer_entity_1.Layer,
          TemplateImage_entity_1.Image,
          TemplateFont_entity_1.Font,
        ]),
        AppConfig_module_1.AppConfigModule,
      ],
      controllers: [TemplateEdit_controller_1.EditImageController],
      providers: [TemplateEdit_service_1.EditImageService],
    }),
  ],
  EditImageModule,
);
exports.EditImageModule = EditImageModule;
//# sourceMappingURL=TemplateEdit.module.js.map
