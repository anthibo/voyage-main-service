import {MigrationInterface, QueryRunner} from "typeorm";

export class deopReviewPhotos1654303913667 implements MigrationInterface {
    name = 'deopReviewPhotos1654303913667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP COLUMN "photos"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP COLUMN "photos"
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ADD "photos" text NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "cities"
            ADD "photos" text NOT NULL DEFAULT ''
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_ca907d3410f0c63e22a21002887"
        `);
        await queryRunner.query(`
            ALTER TABLE "cities" DROP COLUMN "photos"
        `);
        await queryRunner.query(`
            ALTER TABLE "places" DROP COLUMN "photos"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD "photos" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD "photos" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_3efe82cc0f4fb22bcee017dd355" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
