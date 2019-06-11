import { MigrationInterface, QueryRunner } from 'typeorm';

export class wizardPage1560229009872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "wizard_page" ("EntId" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "pageId" SERIAL NOT NULL, "pageTitle" character varying(127) NOT NULL, "pageNumber" bigint NOT NULL, "categoryEntId" integer, "categoryId" integer, CONSTRAINT "PK_c5db6a37e6e4822949e4cf683af" PRIMARY KEY ("EntId", "pageId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wizard_page_layer_master_ids_layer_master" ("wizardPageEntId" integer NOT NULL, "wizardPagePageId" integer NOT NULL, "layerMasterEntId" integer NOT NULL, "layerMasterLayerMasterId" integer NOT NULL, CONSTRAINT "PK_ce3a9148671979a250723a2988d" PRIMARY KEY ("wizardPageEntId", "wizardPagePageId", "layerMasterEntId", "layerMasterLayerMasterId"))`,
    );
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "height"`);
    await queryRunner.query(`ALTER TABLE "layer_frame" ADD "height" float NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "width"`);
    await queryRunner.query(`ALTER TABLE "layer_frame" ADD "width" float NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "x"`);
    await queryRunner.query(`ALTER TABLE "layer_frame" ADD "x" float NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "y"`);
    await queryRunner.query(`ALTER TABLE "layer_frame" ADD "y" float NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "layer_font" DROP COLUMN "fontSize"`);
    await queryRunner.query(`ALTER TABLE "layer_font" ADD "fontSize" float`);
    await queryRunner.query(
      `ALTER TABLE "wizard_page" ADD CONSTRAINT "FK_252ac044f56a88f7db454a37c92" FOREIGN KEY ("categoryEntId", "categoryId") REFERENCES "category"("EntId","id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "wizard_page_layer_master_ids_layer_master" ADD CONSTRAINT "FK_cea2cb60eb632dde6ad1ae60e0f" FOREIGN KEY ("wizardPageEntId", "wizardPagePageId") REFERENCES "wizard_page"("EntId","pageId") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "wizard_page_layer_master_ids_layer_master" ADD CONSTRAINT "FK_01175963840f147b7ee64d8c141" FOREIGN KEY ("layerMasterEntId", "layerMasterLayerMasterId") REFERENCES "layer_master"("EntId","layerMasterId") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "wizard_page_layer_master_ids_layer_master" DROP CONSTRAINT "FK_01175963840f147b7ee64d8c141"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wizard_page_layer_master_ids_layer_master" DROP CONSTRAINT "FK_cea2cb60eb632dde6ad1ae60e0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wizard_page" DROP CONSTRAINT "FK_252ac044f56a88f7db454a37c92"`,
    );
    await queryRunner.query(`ALTER TABLE "layer_font" DROP COLUMN "fontSize"`);
    await queryRunner.query(`ALTER TABLE "layer_font" ADD "fontSize" double precision`);
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "y"`);
    await queryRunner.query(
      `ALTER TABLE "layer_frame" ADD "y" double precision NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "x"`);
    await queryRunner.query(
      `ALTER TABLE "layer_frame" ADD "x" double precision NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "width"`);
    await queryRunner.query(
      `ALTER TABLE "layer_frame" ADD "width" double precision NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(`ALTER TABLE "layer_frame" DROP COLUMN "height"`);
    await queryRunner.query(
      `ALTER TABLE "layer_frame" ADD "height" double precision NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(`DROP TABLE "wizard_page_layer_master_ids_layer_master"`);
    await queryRunner.query(`DROP TABLE "wizard_page"`);
  }
}
