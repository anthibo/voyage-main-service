import {MigrationInterface, QueryRunner} from "typeorm";

export class addCitiesAndPhotosTables1648904783642 implements MigrationInterface {
    name = 'addCitiesAndPhotosTables1648904783642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "cities" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(55) NOT NULL,
                "description" character varying NOT NULL,
                "weather_api" character varying NOT NULL,
                "rating" integer NOT NULL DEFAULT '4',
                "location" geography(Point, 4326) NOT NULL,
                CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6" UNIQUE ("name"),
                CONSTRAINT "UQ_fcbbde7844bd57dfb1879408b5b" UNIQUE ("weather_api"),
                CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b0c5868a3c4663b0e72a6030a6" ON "cities" USING GiST ("location")
        `);
        await queryRunner.query(`
            CREATE TABLE "city_photos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "path" character varying NOT NULL,
                "cityId" uuid,
                CONSTRAINT "UQ_74ab7f8b20f48ca778f7e162350" UNIQUE ("path"),
                CONSTRAINT "PK_df3024c7ce96f7d659ceec4407d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "city_photos"
            ADD CONSTRAINT "FK_90416b5e4cb42077a9739338558" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_photos" DROP CONSTRAINT "FK_90416b5e4cb42077a9739338558"
        `);
        await queryRunner.query(`
            DROP TABLE "city_photos"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b0c5868a3c4663b0e72a6030a6"
        `);
        await queryRunner.query(`
            DROP TABLE "cities"
        `);
    }

}
