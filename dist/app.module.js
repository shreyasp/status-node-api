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
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const typeorm_2 = require('typeorm');
const app_controller_1 = require('./app.controller');
const app_service_1 = require('./app.service');
const AppVersion_module_1 = require('./modules/AppVersion/AppVersion.module');
const ping_controller_1 = require('./modules/Ping/ping.controller');
const TemplateCategory_module_1 = require('./modules/TemplateCategory/TemplateCategory.module');
const TemplateEdit_module_1 = require('./modules/TemplateEdit/TemplateEdit.module');
const TemplateFont_module_1 = require('./modules/TemplateFont/TemplateFont.module');
const TemplateImage_module_1 = require('./modules/TemplateImage/TemplateImage.module');
const TemplateImageLayer_module_1 = require('./modules/TemplateImageLayer/TemplateImageLayer.module');
let AppModule = class AppModule {
  constructor(connection) {
    this.connection = connection;
  }
};
AppModule = __decorate(
  [
    common_1.Module({
      imports: [
        typeorm_1.TypeOrmModule.forRoot(),
        TemplateCategory_module_1.TemplateCategoryModule,
        TemplateFont_module_1.TemplateFontModule,
        TemplateImage_module_1.TemplateImageModule,
        TemplateEdit_module_1.EditImageModule,
        TemplateImageLayer_module_1.TemplateLayerModule,
        AppVersion_module_1.AppVersionModule,
      ],
      controllers: [app_controller_1.AppController, ping_controller_1.PingController],
      providers: [app_service_1.AppService],
    }),
    __metadata('design:paramtypes', [typeorm_2.Connection]),
  ],
  AppModule,
);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
