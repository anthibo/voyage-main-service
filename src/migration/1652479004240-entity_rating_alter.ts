import {MigrationInterface, QueryRunner} from "typeorm";

export class entityRatingAlter1652479004240 implements MigrationInterface {
    name = 'entityRatingAlter1652479004240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "places" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ADD "rating" real NOT NULL DEFAULT '4'
        `);
        await queryRunner.query(`
            ALTER TABLE "cities" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "cities"
            ADD "rating" real NOT NULL DEFAULT '4'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "cities" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "cities"
            ADD "rating" integer NOT NULL DEFAULT '4'
        `);
        await queryRunner.query(`
            ALTER TABLE "places" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ADD "rating" integer NOT NULL DEFAULT '4'
        `);
    }

}
