import {MigrationInterface, QueryRunner} from "typeorm";

export class photosReviews1652917459467 implements MigrationInterface {
    name = 'photosReviews1652917459467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "review" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "photos" text NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "photos"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "review"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "rating" integer NOT NULL
        `);
    }

}
