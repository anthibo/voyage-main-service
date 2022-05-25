import {MigrationInterface, QueryRunner} from "typeorm";

export class editRating1653261917229 implements MigrationInterface {
    name = 'editRating1653261917229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "place_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "review" character varying NOT NULL,
                "photos" text NOT NULL,
                "placeId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_21653e81a5fc4b599a2509a107d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings"
            ADD "rating" double precision NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings"
            ADD "rating" double precision NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_3efe82cc0f4fb22bcee017dd355" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_2408a574374ad22151917c3a38f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_2408a574374ad22151917c3a38f"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_3efe82cc0f4fb22bcee017dd355"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings"
            ADD "rating" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings" DROP COLUMN "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings"
            ADD "rating" integer NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "place_reviews"
        `);
    }

}
