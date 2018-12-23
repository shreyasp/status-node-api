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
const TemplateImage_service_1 = require('./TemplateImage.service');
let ImageController = class ImageController {
  constructor(imageService) {
    this.imageService = imageService;
  }
  getAllImages(query) {
    return this.imageService.findAllImages(query.page);
  }
  getImage(id) {
    return this.imageService.findOneImage(id);
  }
  getImagesByCategory(categoryId) {
    return this.imageService.findImageByCategoryId(categoryId);
  }
  createImage(reqBody) {
    return this.imageService.createImage(reqBody.imageName, reqBody.categoryId);
  }
  uploadTemplateBackground(imageId, uniqName, background) {
    return this.imageService
      .uploadTemplateBackground(imageId, uniqName, background)
      .catch(err => err);
  }
  uploadTemplate(imageId, uniqName, template) {
    return this.imageService.uploadTemplate(imageId, uniqName, template).catch(err => err);
  }
  updateTrendingNow(id, reqBody) {
    return this.imageService.updateTrendingNow(id, reqBody.isTredingNow).catch(err => err);
  }
  toggleImageActive(id) {
    return this.imageService.toggleImageActive(id);
  }
};
__decorate(
  [
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  ImageController.prototype,
  'getAllImages',
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
  ImageController.prototype,
  'getImage',
  null,
);
__decorate(
  [
    common_1.Get('/byCategory/:categoryId'),
    __param(0, common_1.Param('categoryId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  ImageController.prototype,
  'getImagesByCategory',
  null,
);
__decorate(
  [
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ImageController.prototype,
  'createImage',
  null,
);
__decorate(
  [
    common_1.Put(':id/background/:uniqName'),
    common_2.UseInterceptors(common_2.FileInterceptor('background')),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Param('uniqName')),
    __param(2, common_1.UploadedFile()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  ImageController.prototype,
  'uploadTemplateBackground',
  null,
);
__decorate(
  [
    common_1.Put(':id/template/:uniqName'),
    common_2.UseInterceptors(common_2.FileInterceptor('template')),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Param('uniqName')),
    __param(2, common_1.UploadedFile()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  ImageController.prototype,
  'uploadTemplate',
  null,
);
__decorate(
  [
    common_1.Put(':id/updateTrendingNow'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  ImageController.prototype,
  'updateTrendingNow',
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
  ImageController.prototype,
  'toggleImageActive',
  null,
);
ImageController = __decorate(
  [
    common_1.Controller('image'),
    __metadata('design:paramtypes', [TemplateImage_service_1.ImageService]),
  ],
  ImageController,
);
exports.ImageController = ImageController;
//# sourceMappingURL=TemplateImage.controller.js.map
