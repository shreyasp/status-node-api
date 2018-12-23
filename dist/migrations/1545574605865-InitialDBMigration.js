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
class InitialDBMigration1545574605865 {
  up(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {
      yield queryRunner.query(
        `CREATE TABLE "common_entity" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "date" character varying NOT NULL, CONSTRAINT "PK_00a759ffd8d84870dc18e2e3721" PRIMARY KEY ("EntId"))`,
      );
      yield queryRunner.query(
        `CREATE INDEX "IDX_d1313ff99faa826aaa7e3bbb99" ON "common_entity"  ("date") `,
      );
      yield queryRunner.query(
        `CREATE INDEX "IDX_fe8df74214d2f3eaf5a1782523" ON "common_entity"  ("EntId", "date") `,
      );
      yield queryRunner.query(
        `CREATE TABLE "app_version" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "clientName" character varying(16) NOT NULL, "majorVersion" integer NOT NULL DEFAULT 0, "minorVersion" integer NOT NULL DEFAULT 0, "patchVersion" integer NOT NULL DEFAULT 0, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_bb769a3d1e6c6e9af7da04e2782" PRIMARY KEY ("EntId", "id"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "layer_style" ("styleId" SERIAL NOT NULL, "color" character varying, "opacity" integer, CONSTRAINT "PK_09ce90a981f4c8bfef1af272241" PRIMARY KEY ("styleId"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "layer_frame" ("frameId" SERIAL NOT NULL, "height" float NOT NULL DEFAULT 0, "width" float NOT NULL DEFAULT 0, "x" float NOT NULL DEFAULT 0, "y" float NOT NULL DEFAULT 0, CONSTRAINT "PK_fa9def263ef9c68d13c23c11452" PRIMARY KEY ("frameId"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "layer_font" ("fontId" SERIAL NOT NULL, "fontName" character varying, "fontSize" float, CONSTRAINT "PK_ab79fef35c3b7afae6719ee5224" PRIMARY KEY ("fontId"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "layer" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "layerId" SERIAL NOT NULL, "name" character varying NOT NULL, "alignment" character varying, "layerParent" character varying NOT NULL, "text" character varying, "type" character varying NOT NULL, "isActive" boolean NOT NULL, "styleStyleId" integer, "fontFontId" integer, "frameFrameId" integer, "imageEntId" integer, "imageId" integer, CONSTRAINT "REL_4ff72047062b3791b790f0bc54" UNIQUE ("styleStyleId"), CONSTRAINT "REL_860c4833f87af1495d41e2bcc0" UNIQUE ("fontFontId"), CONSTRAINT "REL_d26d66a55f56f920765565a978" UNIQUE ("frameFrameId"), CONSTRAINT "PK_556a4e9cbe6678d26904dc1af55" PRIMARY KEY ("EntId", "layerId"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "image" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "templateUrl" text, "templateBackgroundUrl" text, "isActive" boolean NOT NULL DEFAULT true, "categoryEntId" integer, "categoryId" integer, CONSTRAINT "PK_3620cfde0401233b7080c3febb5" PRIMARY KEY ("EntId", "id"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "category" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "displayName" character varying(64) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "categoryIconUrl" character varying(255), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_54df96c0db68ca85fd27b54b4d8" PRIMARY KEY ("EntId", "id"))`,
      );
      yield queryRunner.query(
        `CREATE TABLE "font" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "fontName" character varying(64) NOT NULL, "fontExtension" character varying(4), "fontPath" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f0d5688d9093ae05fe3a662649a" UNIQUE ("fontName"), CONSTRAINT "PK_f0cea21996c14c0899931c3410f" PRIMARY KEY ("EntId", "id"))`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" ADD CONSTRAINT "FK_4ff72047062b3791b790f0bc54f" FOREIGN KEY ("styleStyleId") REFERENCES "layer_style"("styleId")`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" ADD CONSTRAINT "FK_860c4833f87af1495d41e2bcc02" FOREIGN KEY ("fontFontId") REFERENCES "layer_font"("fontId")`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" ADD CONSTRAINT "FK_d26d66a55f56f920765565a9786" FOREIGN KEY ("frameFrameId") REFERENCES "layer_frame"("frameId")`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" ADD CONSTRAINT "FK_9bf9dd94ea41de2c4076c530031" FOREIGN KEY ("imageEntId", "imageId") REFERENCES "image"("EntId","id")`,
      );
      yield queryRunner.query(
        `ALTER TABLE "image" ADD CONSTRAINT "FK_67b5255a7c65754f947b7ac5182" FOREIGN KEY ("categoryEntId", "categoryId") REFERENCES "category"("EntId","id")`,
      );
    });
  }
  down(queryRunner) {
    return __awaiter(this, void 0, void 0, function*() {
      yield queryRunner.query(
        `ALTER TABLE "image" DROP CONSTRAINT "FK_67b5255a7c65754f947b7ac5182"`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" DROP CONSTRAINT "FK_9bf9dd94ea41de2c4076c530031"`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" DROP CONSTRAINT "FK_d26d66a55f56f920765565a9786"`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" DROP CONSTRAINT "FK_860c4833f87af1495d41e2bcc02"`,
      );
      yield queryRunner.query(
        `ALTER TABLE "layer" DROP CONSTRAINT "FK_4ff72047062b3791b790f0bc54f"`,
      );
      yield queryRunner.query(`DROP TABLE "font"`);
      yield queryRunner.query(`DROP TABLE "category"`);
      yield queryRunner.query(`DROP TABLE "image"`);
      yield queryRunner.query(`DROP TABLE "layer"`);
      yield queryRunner.query(`DROP TABLE "layer_font"`);
      yield queryRunner.query(`DROP TABLE "layer_frame"`);
      yield queryRunner.query(`DROP TABLE "layer_style"`);
      yield queryRunner.query(`DROP TABLE "app_version"`);
      yield queryRunner.query(`DROP INDEX "IDX_fe8df74214d2f3eaf5a1782523"`);
      yield queryRunner.query(`DROP INDEX "IDX_d1313ff99faa826aaa7e3bbb99"`);
      yield queryRunner.query(`DROP TABLE "common_entity"`);
    });
  }
}
exports.InitialDBMigration1545574605865 = InitialDBMigration1545574605865;
//# sourceMappingURL=1545574605865-InitialDBMigration.js.map
