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
const typeorm_1 = require('@nestjs/typeorm');
const lodash_1 = require('lodash');
const typeorm_2 = require('typeorm');
const TemplateCategory_entity_1 = require('./TemplateCategory.entity');
let CategoryService = class CategoryService {
  constructor(CategoryRepository) {
    this.CategoryRepository = CategoryRepository;
  }
  findAllCategories(page = 1) {
    const queryBuilder = this.CategoryRepository.createQueryBuilder('category');
    const offset = (page - 1) * 10;
    return queryBuilder
      .where({ isActive: true })
      .limit(10)
      .offset(offset)
      .getManyAndCount()
      .then(data => {
        const categories = data[0];
        const totalCategories = data[1];
        if (lodash_1.isEmpty(categories)) {
          return {
            success: true,
            message: 'No Category objects present in the database',
            data: {
              categories: [],
              totalPages: 1,
              currentPage: 1,
            },
          };
        }
        return {
          success: true,
          message: 'Fetched all active categories successfully',
          data: {
            categories: lodash_1.map(categories, c => lodash_1.omit(c, ['EntId', 'isActive'])),
            totalPages: lodash_1.ceil(totalCategories / 10),
            currentPage: lodash_1.toNumber(page),
          },
        };
      })
      .catch(err => err);
  }
  findOneCategory(id) {
    const queryBuilder = this.CategoryRepository.createQueryBuilder('category');
    return queryBuilder
      .where('id = :id', { id })
      .getOne()
      .then(category => {
        return {
          success: true,
          message: `Fetched Category with id:${id} successfully`,
          data: lodash_1.omit(category, ['EntId', 'isActive']),
        };
      })
      .catch(err => err);
  }
  createCategory(createObj) {
    return this.CategoryRepository.save(createObj)
      .then(obj => obj)
      .catch(err => err);
  }
  updateCategory(id, updateObj) {
    return this.CategoryRepository.update({ id }, Object.assign({}, updateObj));
  }
  deactivateCategory(id) {
    return this.CategoryRepository.update({ id }, { isActive: false });
  }
};
CategoryService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(TemplateCategory_entity_1.Category)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  CategoryService,
);
exports.CategoryService = CategoryService;
//# sourceMappingURL=TemplateCategory.service.js.map
