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
const typeorm_1 = require('typeorm');
const common_entity_1 = require('../../entities/common.entity');
let AppVersion = class AppVersion extends common_entity_1.CommonEntity {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  AppVersion.prototype,
  'id',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'varchar',
      length: 16,
    }),
    __metadata('design:type', String),
  ],
  AppVersion.prototype,
  'clientName',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'integer',
      default: 0,
    }),
    __metadata('design:type', Number),
  ],
  AppVersion.prototype,
  'majorVersion',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'integer',
      default: 0,
    }),
    __metadata('design:type', Number),
  ],
  AppVersion.prototype,
  'minorVersion',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'integer',
      default: 0,
    }),
    __metadata('design:type', Number),
  ],
  AppVersion.prototype,
  'patchVersion',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'boolean',
      default: true,
    }),
    __metadata('design:type', Boolean),
  ],
  AppVersion.prototype,
  'isActive',
  void 0,
);
AppVersion = __decorate([typeorm_1.Entity()], AppVersion);
exports.AppVersion = AppVersion;
//# sourceMappingURL=AppVersion.entity.js.map
