import { MigrationInterface, QueryRunner } from 'typeorm';

export class activeWizardPage1560351106124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "wizard_page" ADD "isActive" boolean NOT NULL DEFAULT true`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
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
    await queryRunner.query(`ALTER TABLE "wizard_page" DROP COLUMN "isActive"`);
  }
}
