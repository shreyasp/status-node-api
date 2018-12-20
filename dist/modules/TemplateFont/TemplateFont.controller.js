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
const common_2 = require('@nestjs/common');
const TemplateFont_service_1 = require('./TemplateFont.service');
let FontController = class FontController {
  constructor(fontService) {
    this.fontService = fontService;
  }
  getAllFonts() {
    return this.fontService.findAllFonts();
  }
  getFont(id) {
    return this.fontService.findOneFont(id);
  }
  checkIfFontExists(fontName) {
    return this.fontService.checkIfFontExists(fontName);
  }
  createFont(fontFiles) {
    return this.fontService.createFont(fontFiles);
  }
  toggleFontActive(id) {
    return this.fontService.toggleFontActive(id);
  }
};
__decorate(
  [
    common_1.Get(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Object),
  ],
  FontController.prototype,
  'getAllFonts',
  null,
);
__decorate(
  [
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  FontController.prototype,
  'getFont',
  null,
);
__decorate(
  [
    common_1.Get('exists/:fontName'),
    __param(0, common_1.Param('fontName')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  FontController.prototype,
  'checkIfFontExists',
  null,
);
__decorate(
  [
    common_1.Post(),
    common_2.UseInterceptors(common_2.FilesInterceptor('font')),
    __param(0, common_1.UploadedFiles()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  FontController.prototype,
  'createFont',
  null,
);
__decorate(
  [
    common_1.Put(':id'),
    __param(0, common_1.Param('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  FontController.prototype,
  'toggleFontActive',
  null,
);
FontController = __decorate(
  [
    common_1.Controller('font'),
    __metadata('design:paramtypes', [TemplateFont_service_1.FontService]),
  ],
  FontController,
);
exports.FontController = FontController;
//# sourceMappingURL=TemplateFont.controller.js.map
