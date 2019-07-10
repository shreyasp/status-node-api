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
const TemplateWizardPage_entity_1 = require('./TemplateWizardPage.entity');
const LayerMaster_entity_1 = require('../TemplateImageLayer/LayerMaster.entity');
let WizardPageService = class WizardPageService {
  constructor(wizardPageRepository, layerMasterRepository) {
    this.wizardPageRepository = wizardPageRepository;
    this.layerMasterRepository = layerMasterRepository;
  }
  getAllWizardPagesByCategory(category) {
    const queryBuilder = this.wizardPageRepository.createQueryBuilder('wizardPage');
    return queryBuilder
      .innerJoinAndSelect('wizardPage.category', 'category', 'wizardPage.category = :category', {
        category,
      })
      .leftJoinAndSelect('wizardPage.layerMasters', 'layerMasters')
      .where({ isActive: true })
      .getManyAndCount()
      .then(data => {
        const wizardPages = data[0];
        const totalWizardPages = data[1];
        if (lodash_1.isEmpty(wizardPages)) {
          return {
            success: true,
            message: 'No wizard pages present for given category in the database',
            data: {
              wizardPages,
              totalWizardPages,
            },
          };
        } else {
          return {
            success: true,
            message: 'Successfully fetched wizard pages for the given category',
            data: {
              wizardPages,
              totalWizardPages,
            },
          };
        }
      })
      .catch(err => ({
        success: false,
        message: 'Something went wrong while trying to retrieve wizard pages',
        err,
      }));
  }
  createWizardPageByCategory(category, wizPage, layerMasterIds) {
    const queryBuilder = this.layerMasterRepository.createQueryBuilder('layerMaster');
    return queryBuilder
      .where('layerMaster.layerMasterId IN(:...layerMasterIds)', { layerMasterIds })
      .getMany()
      .then(data => {
        return this.wizardPageRepository
          .save(Object.assign({}, wizPage, { category, layerMasters: data }))
          .then(createdWizPage => ({
            success: true,
            message: 'Created Wizard Page successfully',
            data: createdWizPage,
          }))
          .catch(err => ({
            success: false,
            message: 'Something went wrong while creating a Wizard Page',
            err,
          }));
      })
      .catch(err => err);
  }
};
WizardPageService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(TemplateWizardPage_entity_1.WizardPage)),
    __param(1, typeorm_1.InjectRepository(LayerMaster_entity_1.LayerMaster)),
    __metadata('design:paramtypes', [typeorm_2.Repository, typeorm_2.Repository]),
  ],
  WizardPageService,
);
exports.WizardPageService = WizardPageService;
//# sourceMappingURL=TemplateWizardPage.service.js.map
