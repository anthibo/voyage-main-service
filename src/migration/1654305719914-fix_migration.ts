import {MigrationInterface, QueryRunner} from "typeorm";

export class fixMigration1654305719914 implements MigrationInterface {
    name = 'fixMigration1654305719914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_3efe82cc0f4fb22bcee017dd355"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
                RENAME COLUMN "cityId" TO "placeId"
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ALTER COLUMN "photos" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "cities"
            ALTER COLUMN "photos" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_ca907d3410f0c63e22a21002887" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_ca907d3410f0c63e22a21002887"
        `);
        await queryRunner.query(`
            ALTER TABLE "cities"
            ALTER COLUMN "photos"
            SET DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ALTER COLUMN "photos"
            SET DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
                RENAME COLUMN "placeId" TO "cityId"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_3efe82cc0f4fb22bcee017dd355" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
