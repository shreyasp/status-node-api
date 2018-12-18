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
const lodash_2 = require('lodash');
const semver_1 = require('semver');
const typeorm_2 = require('typeorm');
const AppVersion_entity_1 = require('../AppVersion/AppVersion.entity');
let AppVersionService = class AppVersionService {
  constructor(AppVerRepository) {
    this.AppVerRepository = AppVerRepository;
  }
  getVersion(clientName) {
    const queryBuilder = this.AppVerRepository.createQueryBuilder('appVersion');
    return queryBuilder
      .where({ isActive: true })
      .andWhere('appVersion.clientName = :clientName', { clientName })
      .getOne()
      .then(version => {
        if (!version) {
          return {
            success: true,
            message: `No version found for the ${clientName} client`,
            data: null,
          };
        }
        return {
          success: true,
          message: `Fetched version successfuly for ${clientName} client`,
          data: lodash_2.omit(version, ['EntId', 'id', 'isActive']),
        };
      })
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to fetch version for ${clientName}`,
        err,
      }));
  }
  createVersion(clientName, version) {
    const semanticVersion = new semver_1.SemVer(version);
    return this.AppVerRepository.save({
      clientName,
      majorVersion: semanticVersion.major,
      minorVersion: semanticVersion.minor,
      patchVersion: semanticVersion.patch,
    })
      .then(newVersion => ({
        success: true,
        message: `Created a new version for ${clientName}`,
        data: lodash_2.omit(newVersion, ['id', 'EntId']),
      }))
      .catch(err => ({
        success: false,
        message: `Something went while trying to create a new version for ${clientName}`,
        err,
      }));
  }
  incrementVersion(clientName, versionType) {
    return this.AppVerRepository.increment({ clientName }, lodash_1.camelCase(versionType), 1)
      .then(() => ({
        success: true,
        message: `Successfully incremented ${lodash_2.startCase(versionType)} for ${clientName}`,
      }))
      .catch(err => ({
        success: false,
        message: `Something went wrong while trying to increment ${lodash_2.startCase(
          versionType,
        )} for ${clientName}`,
        err,
      }));
  }
};
AppVersionService = __decorate(
  [
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(AppVersion_entity_1.AppVersion)),
    __metadata('design:paramtypes', [typeorm_2.Repository]),
  ],
  AppVersionService,
);
exports.AppVersionService = AppVersionService;
//# sourceMappingURL=AppVersion.service.js.map
