import {MigrationInterface, QueryRunner} from "typeorm";

export class tripPlaces1655592824623 implements MigrationInterface {
    name = 'tripPlaces1655592824623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "trip_places"
            ADD "id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places" DROP CONSTRAINT "PK_7cf3a5198fa3ffb1f19e8cef59c"
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places"
            ADD CONSTRAINT "PK_142d725fa085581c1d2215dab03" PRIMARY KEY ("tripId", "placeId", "id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "trip_places" DROP CONSTRAINT "PK_142d725fa085581c1d2215dab03"
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places"
            ADD CONSTRAINT "PK_7cf3a5198fa3ffb1f19e8cef59c" PRIMARY KEY ("tripId", "placeId")
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places" DROP COLUMN "id"
        `);
    }

}
