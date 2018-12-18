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
var __param =
  (this && this.__param) ||
  function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const common_1 = require('@nestjs/common');
const AppVersion_service_1 = require('./AppVersion.service');
let AppVersionController = class AppVersionController {
  constructor(appVersionService) {
    this.appVersionService = appVersionService;
  }
  getAppVersion(clientName) {
    return this.appVersionService.getVersion(clientName);
  }
  createAppVersion(clientName, reqBody) {
    return this.appVersionService.createVersion(clientName, reqBody.version);
  }
  incrementVersion(clientName, versionType) {
    return this.appVersionService.incrementVersion(clientName, `${versionType}Version`);
  }
};
__decorate(
  [
    common_1.Get(':clientName'),
    __param(0, common_1.Param('clientName')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  AppVersionController.prototype,
  'getAppVersion',
  null,
);
__decorate(
  [
    common_1.Post(':clientName/create/'),
    __param(0, common_1.Param('clientName')),
    __param(1, common_1.Body()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', Object),
  ],
  AppVersionController.prototype,
  'createAppVersion',
  null,
);
__decorate(
  [
    common_1.Post(':clientName/incr/:versionType'),
    __param(0, common_1.Param('clientName')),
    __param(1, common_1.Param('versionType')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', Object),
  ],
  AppVersionController.prototype,
  'incrementVersion',
  null,
);
AppVersionController = __decorate(
  [
    common_1.Controller('appVersion'),
    __metadata('design:paramtypes', [AppVersion_service_1.AppVersionService]),
  ],
  AppVersionController,
);
exports.AppVersionController = AppVersionController;
//# sourceMappingURL=AppVersion.controller.js.map
