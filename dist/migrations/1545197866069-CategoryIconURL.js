'use strict';
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
class CategoryIconURL1545197866069 {
  up(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {
      yield queryRunner.query(
        `ALTER TABLE "category" ADD "categoryIconUrl" character varying(255)`,
      );
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "height"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "height" float NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "width"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "width" float NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "x"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "x" float NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "y"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "y" float NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_font" DROP COLUMN "fontSize"`);
      yield queryRunner.query(`ALTER TABLE "layer_font" ADD "fontSize" float`);
    });
  }
  down(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {
      yield queryRunner.query(`ALTER TABLE "layer_font" DROP COLUMN "fontSize"`);
      yield queryRunner.query(`ALTER TABLE "layer_font" ADD "fontSize" double precision`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "y"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "y" double precision NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "x"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "x" double precision NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "width"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "width" double precision NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "height"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "height" double precision NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "category" DROP COLUMN "categoryIconUrl"`);
    });
  }
}
exports.CategoryIconURL1545197866069 = CategoryIconURL1545197866069;
//# sourceMappingURL=1545197866069-CategoryIconURL.js.map
