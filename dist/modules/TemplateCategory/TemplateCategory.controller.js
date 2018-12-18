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
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const common_1 = require('@nestjs/common');
const common_2 = require('@nestjs/common');
const TemplateCategory_dto_1 = require('./dto/TemplateCategory.dto');
const TemplateCategory_service_1 = require('./TemplateCategory.service');
let CategoryController = class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }
  getAllCategories(query) {
    return this.categoryService.findAllCategories(query.page);
  }
  getCategory(id) {
    return this.categoryService.findOneCategory(id);
  }
  createCategory(categoryDTO) {
    return __awaiter(this, void 0, void 0, function*() {
      return this.categoryService
        .createCategory(categoryDTO)
        .then(category => category)
        .catch(err => err);
    });
  }
  uploadCategoryIcon(id, icon) {
    return this.categoryService
      .addUpdateCategoryIcon(id, icon)
      .then(category => category)
      .catch(err => err);
  }
  updateCategory(id, categoryDTO) {
    return this.categoryService.updateCategory(id, categoryDTO);
  }
  deactivateCategory(id) {
    return this.categoryService.deactivateCategory(id);
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
  CategoryController.prototype,
  'getAllCategories',
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
  CategoryController.prototype,
  'getCategory',
  null,
);
__decorate(
  [
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [TemplateCategory_dto_1.TemplateCategoryDTO]),
    __metadata('design:returntype', Promise),
  ],
  CategoryController.prototype,
  'createCategory',
  null,
);
__decorate(
  [
    common_1.Post(':id/categoryIcon'),
    common_2.UseInterceptors(common_2.FileInterceptor('icon')),
    __param(0, common_1.Param('id')),
    __param(1, common_1.UploadedFile()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  CategoryController.prototype,
  'uploadCategoryIcon',
  null,
);
__decorate(
  [
    common_1.Put(':id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, TemplateCategory_dto_1.TemplateCategoryDTO]),
    __metadata('design:returntype', void 0),
  ],
  CategoryController.prototype,
  'updateCategory',
  null,
);
__decorate(
  [
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Object),
  ],
  CategoryController.prototype,
  'deactivateCategory',
  null,
);
CategoryController = __decorate(
  [
    common_1.Controller('category'),
    __metadata('design:paramtypes', [TemplateCategory_service_1.CategoryService]),
  ],
  CategoryController,
);
exports.CategoryController = CategoryController;
//# sourceMappingURL=TemplateCategory.controller.js.map
