import {MigrationInterface, QueryRunner} from "typeorm";

export class trips1654896597695 implements MigrationInterface {
    name = 'trips1654896597695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "trip_places" (
                "isChecked" boolean NOT NULL DEFAULT false,
                "tripId" uuid NOT NULL,
                "placeId" uuid NOT NULL,
                CONSTRAINT "PK_7cf3a5198fa3ffb1f19e8cef59c" PRIMARY KEY ("tripId", "placeId")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."trips_type_enum" AS ENUM('customized', 'generated')
        `);
        await queryRunner.query(`
            CREATE TABLE "trips" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL,
                "name" character varying NOT NULL,
                "startDate" date NOT NULL,
                "endDate" date NOT NULL,
                "type" "public"."trips_type_enum" NOT NULL DEFAULT 'customized',
                "userId" uuid,
                "cityId" uuid,
                CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places"
            ADD CONSTRAINT "FK_fb23156e37a4fc229a5eac06dbc" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places"
            ADD CONSTRAINT "FK_186f0ab7752957ea155198915b8" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_db768456df45322f8a749534322" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_d8926932b8ea2aa8ea85db56d78" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_d8926932b8ea2aa8ea85db56d78"
        `);
        await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_db768456df45322f8a749534322"
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places" DROP CONSTRAINT "FK_186f0ab7752957ea155198915b8"
        `);
        await queryRunner.query(`
            ALTER TABLE "trip_places" DROP CONSTRAINT "FK_fb23156e37a4fc229a5eac06dbc"
        `);
        await queryRunner.query(`
            DROP TABLE "trips"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."trips_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "trip_places"
        `);
    }

}
