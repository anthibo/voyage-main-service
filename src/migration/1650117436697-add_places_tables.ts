import {MigrationInterface, QueryRunner} from "typeorm";

export class addPlacesTables1650117436697 implements MigrationInterface {
    name = 'addPlacesTables1650117436697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "place_photos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "path" character varying NOT NULL,
                "placeId" uuid,
                CONSTRAINT "UQ_1ddff6ee565a2d44c4310da8e24" UNIQUE ("path"),
                CONSTRAINT "PK_137f021448aa0ee40672a18606a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "places" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(55) NOT NULL,
                "description" character varying NOT NULL,
                "rating" integer NOT NULL DEFAULT '4',
                "location" geography(Point, 4326) NOT NULL,
                "phoneNumber" character varying,
                "website" character varying,
                "activity_type" character varying NOT NULL,
                "price" integer NOT NULL DEFAULT '0',
                "cityId" uuid,
                CONSTRAINT "UQ_d93026712ed97941ccec28f8137" UNIQUE ("name"),
                CONSTRAINT "UQ_a3c3402c4b73257921abfb054d4" UNIQUE ("phoneNumber"),
                CONSTRAINT "UQ_774bb515ff5d63dec823671076f" UNIQUE ("website"),
                CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b8ee226e91e428a57c5d1ac84c" ON "places" USING GiST ("location")
        `);
        await queryRunner.query(`
            ALTER TABLE "place_photos"
            ADD CONSTRAINT "FK_f166a3d2f12bfbecea3b5973c17" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ADD CONSTRAINT "FK_f548129f350a5ed88401d583c8b" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "places" DROP CONSTRAINT "FK_f548129f350a5ed88401d583c8b"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_photos" DROP CONSTRAINT "FK_f166a3d2f12bfbecea3b5973c17"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b8ee226e91e428a57c5d1ac84c"
        `);
        await queryRunner.query(`
            DROP TABLE "places"
        `);
        await queryRunner.query(`
            DROP TABLE "place_photos"
        `);
    }

}
