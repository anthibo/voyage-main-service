import {MigrationInterface, QueryRunner} from "typeorm";

export class createUserTable1646676929317 implements MigrationInterface {
    name = 'createUserTable1646676929317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trip" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "public"."user_securityrole_enum" AS ENUM('admin', 'normal_user', 'business_user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(55) NOT NULL, "lastName" character varying(55) NOT NULL, "username" character varying(55) NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "nationalId" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "securityRole" "public"."user_securityrole_enum" NOT NULL DEFAULT 'normal_user', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_5e30ae7136bce1f6d80d9c0b72d" UNIQUE ("nationalId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_securityrole_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "trip"`);
    }

}
