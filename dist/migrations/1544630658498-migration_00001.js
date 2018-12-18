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
class migration000011544630658498 {
  up(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {});
  }
  down(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {});
  }
}
exports.migration000011544630658498 = migration000011544630658498;
//# sourceMappingURL=1544630658498-migration_00001.js.map
