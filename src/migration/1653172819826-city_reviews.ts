import {MigrationInterface, QueryRunner} from "typeorm";

export class cityReviews1653172819826 implements MigrationInterface {
    name = 'cityReviews1653172819826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "city_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "review" character varying NOT NULL,
                "photos" text NOT NULL,
                "cityId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_4c0fb5de30d93a20246f23909e3" PRIMARY KEY ("id")
            )
        `);
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
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD CONSTRAINT "FK_b334cdc81b5189aaf27b786237b" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD CONSTRAINT "FK_d189c619c6f69296cfbaffaf9e4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP CONSTRAINT "FK_d189c619c6f69296cfbaffaf9e4"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP CONSTRAINT "FK_b334cdc81b5189aaf27b786237b"
        `);
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
        await queryRunner.query(`
            DROP TABLE "city_reviews"
        `);
    }

}
