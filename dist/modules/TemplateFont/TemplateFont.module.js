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
const TemplateFont_controller_1 = require('./TemplateFont.controller');
const TemplateFont_entity_1 = require('./TemplateFont.entity');
const TemplateFont_service_1 = require('./TemplateFont.service');
let TemplateFontModule = class TemplateFontModule {};
TemplateFontModule = __decorate(
  [
    common_1.Module({
      imports: [
        typeorm_1.TypeOrmModule.forFeature([TemplateFont_entity_1.Font]),
        AppConfig_module_1.AppConfigModule,
      ],
      controllers: [TemplateFont_controller_1.FontController],
      providers: [TemplateFont_service_1.FontService],
    }),
  ],
  TemplateFontModule,
);
exports.TemplateFontModule = TemplateFontModule;
//# sourceMappingURL=TemplateFont.module.js.map
