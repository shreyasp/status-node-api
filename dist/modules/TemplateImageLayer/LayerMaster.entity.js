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
let LayerMaster = class LayerMaster extends common_entity_1.CommonEntity {};
__decorate(
  [typeorm_1.PrimaryGeneratedColumn(), __metadata('design:type', Number)],
  LayerMaster.prototype,
  'layerMasterId',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'varchar',
      length: 63,
    }),
    __metadata('design:type', String),
  ],
  LayerMaster.prototype,
  'layerMasterName',
  void 0,
);
__decorate(
  [
    typeorm_1.Column({
      type: 'varchar',
      length: 63,
    }),
    __metadata('design:type', String),
  ],
  LayerMaster.prototype,
  'layerMasterDisplayName',
  void 0,
);
LayerMaster = __decorate([typeorm_1.Entity()], LayerMaster);
exports.LayerMaster = LayerMaster;
//# sourceMappingURL=LayerMaster.entity.js.map
