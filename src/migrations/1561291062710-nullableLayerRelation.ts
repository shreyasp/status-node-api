import { MigrationInterface, QueryRunner } from 'typeorm';

export class nullableLayerRelation1561291062710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "layer" ADD "layerMasterEntId" integer`);
    await queryRunner.query(`ALTER TABLE "layer" ADD "layerMasterLayerMasterId" integer`);
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
      `ALTER TABLE "layer" ADD CONSTRAINT "FK_4183f15ac4502b4fae4f025b483" FOREIGN KEY ("layerMasterEntId", "layerMasterLayerMasterId") REFERENCES "layer_master"("EntId","layerMasterId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "layer" DROP CONSTRAINT "FK_4183f15ac4502b4fae4f025b483"`);
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
    await queryRunner.query(`ALTER TABLE "layer" DROP COLUMN "layerMasterLayerMasterId"`);
    await queryRunner.query(`ALTER TABLE "layer" DROP COLUMN "layerMasterEntId"`);
  }
}
