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
const LayerMaster_service_1 = require('./LayerMaster.service');
let LayerMasterController = class LayerMasterController {
  constructor(layerMasterService) {
    this.layerMasterService = layerMasterService;
  }
  getLayerMaster() {
    return this.layerMasterService.getAllLayerMaster();
  }
  createLayerMaster(reqBody) {
    return this.layerMasterService.createLayerMaster(reqBody);
  }
};
__decorate(
  [
    common_1.Get(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Object),
  ],
  LayerMasterController.prototype,
  'getLayerMaster',
  null,
);
__decorate(
  [
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  LayerMasterController.prototype,
  'createLayerMaster',
  null,
);
LayerMasterController = __decorate(
  [
    common_1.Controller('layerMaster'),
    __metadata('design:paramtypes', [LayerMaster_service_1.LayerMasterService]),
  ],
  LayerMasterController,
);
exports.LayerMasterController = LayerMasterController;
//# sourceMappingURL=LayerMaster.controller.js.map
