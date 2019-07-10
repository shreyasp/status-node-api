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
class addWizardPageSupport1561900838097 {
  up(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {
      yield queryRunner.query(
        `CREATE TABLE "layer_master" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "layerMasterId" SERIAL NOT NULL, "layerMasterName" character varying(63) NOT NULL, "layerMasterDisplayName" character varying(63) NOT NULL, CONSTRAINT "PK_1c51f1495a9e96b5f8045600537" PRIMARY KEY ("EntId", "layerMasterId"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "wizard_page" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "pageId" SERIAL NOT NULL, "pageTitle" character varying(127) NOT NULL, "pageNumber" bigint NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "categoryEntId" integer, "categoryId" integer, CONSTRAINT "PK_c5db6a37e6e4822949e4cf683af" PRIMARY KEY ("EntId", "pageId"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "wizard_page_layer_masters_layer_master" ("wizardPageEntId" integer NOT NULL, "wizardPagePageId" integer NOT NULL, "layerMasterEntId" integer NOT NULL, "layerMasterLayerMasterId" integer NOT NULL, CONSTRAINT "PK_06355088d3657423d1c65bd112e" PRIMARY KEY ("wizardPageEntId", "wizardPagePageId", "layerMasterEntId", "layerMasterLayerMasterId"))`,
      );
      yield queryRunner.query(`ALTER TABLE "layer" ADD "layerMasterId" integer NOT NULL`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "height"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "height" float NOT NULL DEFAULT 0`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "width"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "width" float NOT NULL DEFAULT 0`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "x"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "x" float NOT NULL DEFAULT 0`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "y"`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" ADD "y" float NOT NULL DEFAULT 0`);
      yield queryRunner.query(`ALTER TABLE "layer_font" DROP COLUMN "fontSize"`);
      yield queryRunner.query(`ALTER TABLE "layer_font" ADD "fontSize" float`);
      yield queryRunner.query(
        `ALTER TABLE "wizard_page" ADD CONSTRAINT "FK_252ac044f56a88f7db454a37c92" FOREIGN KEY ("categoryEntId", "categoryId") REFERENCES "category"("EntId","id")`,
      );
      yield queryRunner.query(
        `ALTER TABLE "wizard_page_layer_masters_layer_master" ADD CONSTRAINT "FK_6f88eb4a0159e41d7cc28b08a9f" FOREIGN KEY ("wizardPageEntId", "wizardPagePageId") REFERENCES "wizard_page"("EntId","pageId") ON DELETE CASCADE`,
      );
      yield queryRunner.query(
        `ALTER TABLE "wizard_page_layer_masters_layer_master" ADD CONSTRAINT "FK_3ffec7d161d58e2b51ccb01b4c3" FOREIGN KEY ("layerMasterEntId", "layerMasterLayerMasterId") REFERENCES "layer_master"("EntId","layerMasterId") ON DELETE CASCADE`,
      );
    });
  }
  down(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {
      yield queryRunner.query(
        `ALTER TABLE "wizard_page_layer_masters_layer_master" DROP CONSTRAINT "FK_3ffec7d161d58e2b51ccb01b4c3"`,
      );
      yield queryRunner.query(
        `ALTER TABLE "wizard_page_layer_masters_layer_master" DROP CONSTRAINT "FK_6f88eb4a0159e41d7cc28b08a9f"`,
      );
      yield queryRunner.query(
        `ALTER TABLE "wizard_page" DROP CONSTRAINT "FK_252ac044f56a88f7db454a37c92"`,
      );
      yield queryRunner.query(`ALTER TABLE "layer_font" DROP COLUMN "fontSize"`);
      yield queryRunner.query(`ALTER TABLE "layer_font" ADD "fontSize" double precision`);
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "y"`);
      yield queryRunner.query(
        `ALTER TABLE "layer_frame" ADD "y" double precision NOT NULL DEFAULT 0`,
      );
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "x"`);
      yield queryRunner.query(
        `ALTER TABLE "layer_frame" ADD "x" double precision NOT NULL DEFAULT 0`,
      );
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "width"`);
      yield queryRunner.query(
        `ALTER TABLE "layer_frame" ADD "width" double precision NOT NULL DEFAULT 0`,
      );
      yield queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "height"`);
      yield queryRunner.query(
        `ALTER TABLE "layer_frame" ADD "height" double precision NOT NULL DEFAULT 0`,
      );
      yield queryRunner.query(`ALTER TABLE "layer" DROP COLUMN "layerMasterId"`);
      yield queryRunner.query(`DROP TABLE "wizard_page_layer_masters_layer_master"`);
      yield queryRunner.query(`DROP TABLE "wizard_page"`);
      yield queryRunner.query(`DROP TABLE "layer_master"`);
    });
  }
}
exports.addWizardPageSupport1561900838097 = addWizardPageSupport1561900838097;
//# sourceMappingURL=1561900838097-addWizardPageSupport.js.map
