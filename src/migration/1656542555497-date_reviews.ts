import {MigrationInterface, QueryRunner} from "typeorm";

export class dateReviews1656542555497 implements MigrationInterface {
    name = 'dateReviews1656542555497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "createdOn" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "modifiedOn" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "deletedOn" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD "createdOn" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD "modifiedOn" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD "deletedOn" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP COLUMN "deletedOn"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP COLUMN "modifiedOn"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP COLUMN "createdOn"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "deletedOn"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "modifiedOn"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "createdOn"
        `);
    }

}
