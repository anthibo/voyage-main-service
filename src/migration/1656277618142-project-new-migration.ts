import {MigrationInterface, QueryRunner} from "typeorm";

export class test1656277618142 implements MigrationInterface {
    name = 'test1656277618142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."agencies_status_enum" AS ENUM('active', 'inactive', 'banned')
        `);
        await queryRunner.query(`
            CREATE TABLE "agencies" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "companyName" character varying(55) NOT NULL,
                "username" character varying(55) NOT NULL,
                "password" character varying NOT NULL,
                "email" character varying NOT NULL,
                "nationalId" character varying NOT NULL,
                "fbLink" character varying,
                "igLink" character varying,
                "phoneNumber" character varying NOT NULL,
                "address" character varying,
                "status" "public"."agencies_status_enum" NOT NULL DEFAULT 'active',
                CONSTRAINT "UQ_07b4f81d1fd0bf92f1968a61bbc" UNIQUE ("username"),
                CONSTRAINT "UQ_d25d2a0363d82243de8434a2e72" UNIQUE ("email"),
                CONSTRAINT "UQ_bef84bf9c1d55f4c08f095c0f19" UNIQUE ("nationalId"),
                CONSTRAINT "UQ_0556eaa647c6840062dbf0a1ea3" UNIQUE ("fbLink"),
                CONSTRAINT "UQ_cf4156991827e4050517bac8005" UNIQUE ("igLink"),
                CONSTRAINT "UQ_a36e83053001e200b41eaee6f82" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "city_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "review" character varying NOT NULL,
                "cityId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_4c0fb5de30d93a20246f23909e3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "place_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "review" character varying NOT NULL,
                "placeId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_21653e81a5fc4b599a2509a107d" PRIMARY KEY ("id")
            )
        `);
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
            CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'banned')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_securityrole_enum" AS ENUM('admin', 'normal_user')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying(55) NOT NULL,
                "lastName" character varying(55) NOT NULL,
                "username" character varying(55) NOT NULL,
                "password" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying,
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'active',
                "securityRole" "public"."users_securityrole_enum" NOT NULL DEFAULT 'normal_user',
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "place_ratings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating" double precision NOT NULL,
                "placeId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_849b8057c7906a869d62e9d29ea" PRIMARY KEY ("id")
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
                "rating" real NOT NULL DEFAULT '4',
                "location" geography(Point, 4326) NOT NULL,
                "photos" text NOT NULL,
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
            CREATE TABLE "transportation_means" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "transportationType" character varying(55) NOT NULL,
                CONSTRAINT "UQ_9e44d7a35060e1e04221b846cc4" UNIQUE ("transportationType"),
                CONSTRAINT "PK_99765ded0286a4540cd786e54e8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "transportation_city_fees" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "km_cost" integer NOT NULL,
                "transportation_id" uuid NOT NULL,
                "city_id" uuid NOT NULL,
                CONSTRAINT "PK_c7d6883419ffc9a6e7c2924785f" PRIMARY KEY ("transportation_id", "city_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "cities" (
                "createdOn" TIMESTAMP NOT NULL DEFAULT now(),
                "modifiedOn" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedOn" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(55) NOT NULL,
                "description" character varying NOT NULL,
                "rating" real NOT NULL DEFAULT '4',
                "location" geography(Point, 4326) NOT NULL,
                "photos" text NOT NULL,
                CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6" UNIQUE ("name"),
                CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b0c5868a3c4663b0e72a6030a6" ON "cities" USING GiST ("location")
        `);
        await queryRunner.query(`
            CREATE TABLE "city_ratings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating" double precision NOT NULL,
                "cityId" uuid,
                "userId" uuid,
                CONSTRAINT "PK_5e6c0c05120111491753a51e9ee" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD CONSTRAINT "FK_b334cdc81b5189aaf27b786237b" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews"
            ADD CONSTRAINT "FK_d189c619c6f69296cfbaffaf9e4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_ca907d3410f0c63e22a21002887" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews"
            ADD CONSTRAINT "FK_2408a574374ad22151917c3a38f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
        await queryRunner.query(`
            ALTER TABLE "place_ratings"
            ADD CONSTRAINT "FK_2c511d9a1f2e744210102cf8322" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings"
            ADD CONSTRAINT "FK_7b0cbb1755b927e8c53a912b468" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "places"
            ADD CONSTRAINT "FK_f548129f350a5ed88401d583c8b" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees"
            ADD CONSTRAINT "FK_107e27892aca882c01d2cbe8a3d" FOREIGN KEY ("transportation_id") REFERENCES "transportation_means"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees"
            ADD CONSTRAINT "FK_d93ec3ba4dbf64a881519ccfd9b" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings"
            ADD CONSTRAINT "FK_6e519a60f550beaf1a16f54eff0" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings"
            ADD CONSTRAINT "FK_b6f22f053d79fa71cd1f39d94f2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city_ratings" DROP CONSTRAINT "FK_b6f22f053d79fa71cd1f39d94f2"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_ratings" DROP CONSTRAINT "FK_6e519a60f550beaf1a16f54eff0"
        `);
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees" DROP CONSTRAINT "FK_d93ec3ba4dbf64a881519ccfd9b"
        `);
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees" DROP CONSTRAINT "FK_107e27892aca882c01d2cbe8a3d"
        `);
        await queryRunner.query(`
            ALTER TABLE "places" DROP CONSTRAINT "FK_f548129f350a5ed88401d583c8b"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings" DROP CONSTRAINT "FK_7b0cbb1755b927e8c53a912b468"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_ratings" DROP CONSTRAINT "FK_2c511d9a1f2e744210102cf8322"
        `);
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
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_2408a574374ad22151917c3a38f"
        `);
        await queryRunner.query(`
            ALTER TABLE "place_reviews" DROP CONSTRAINT "FK_ca907d3410f0c63e22a21002887"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP CONSTRAINT "FK_d189c619c6f69296cfbaffaf9e4"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_reviews" DROP CONSTRAINT "FK_b334cdc81b5189aaf27b786237b"
        `);
        await queryRunner.query(`
            DROP TABLE "city_ratings"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b0c5868a3c4663b0e72a6030a6"
        `);
        await queryRunner.query(`
            DROP TABLE "cities"
        `);
        await queryRunner.query(`
            DROP TABLE "transportation_city_fees"
        `);
        await queryRunner.query(`
            DROP TABLE "transportation_means"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b8ee226e91e428a57c5d1ac84c"
        `);
        await queryRunner.query(`
            DROP TABLE "places"
        `);
        await queryRunner.query(`
            DROP TABLE "place_ratings"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_securityrole_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_status_enum"
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
        await queryRunner.query(`
            DROP TABLE "place_reviews"
        `);
        await queryRunner.query(`
            DROP TABLE "city_reviews"
        `);
        await queryRunner.query(`
            DROP TABLE "agencies"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."agencies_status_enum"
        `);
    }

}
