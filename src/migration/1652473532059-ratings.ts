import {MigrationInterface, QueryRunner} from "typeorm";

export class ratings1652473532059 implements MigrationInterface {
    name = 'ratings1652473532059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "city_ratings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating" integer NOT NULL,
                "cityId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_5e6c0c05120111491753a51e9ee" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "place_ratings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating" integer NOT NULL,
                "placeId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_849b8057c7906a869d62e9d29ea" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings"
            ADD CONSTRAINT "FK_6e519a60f550beaf1a16f54eff0" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings"
            ADD CONSTRAINT "FK_b6f22f053d79fa71cd1f39d94f2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings"
            ADD CONSTRAINT "FK_2c511d9a1f2e744210102cf8322" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings"
            ADD CONSTRAINT "FK_7b0cbb1755b927e8c53a912b468" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "place_ratings" DROP CONSTRAINT "FK_7b0cbb1755b927e8c53a912b468"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings" DROP CONSTRAINT "FK_2c511d9a1f2e744210102cf8322"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings" DROP CONSTRAINT "FK_b6f22f053d79fa71cd1f39d94f2"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings" DROP CONSTRAINT "FK_6e519a60f550beaf1a16f54eff0"
        `);
        await queryRunner.query(`
            DROP TABLE "place_ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "city_ratings"
        `);
    }

}
