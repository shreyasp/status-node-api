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
const TemplateImageLayer_entity_1 = require('./TemplateImageLayer.entity');
const TemplateImageLayer_service_1 = require('./TemplateImageLayer.service');
const TemplateImageLayer_controller_1 = require('./TemplateImageLayer.controller');
let TemplateLayerModule = class TemplateLayerModule {};
TemplateLayerModule = __decorate(
  [
    common_1.Module({
      imports: [typeorm_1.TypeOrmModule.forFeature([TemplateImageLayer_entity_1.Layer])],
      controllers: [TemplateImageLayer_controller_1.LayerController],
      providers: [TemplateImageLayer_service_1.LayerService],
    }),
  ],
  TemplateLayerModule,
);
exports.TemplateLayerModule = TemplateLayerModule;
//# sourceMappingURL=TemplateImageLayer.module.js.map
