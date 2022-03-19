import {MigrationInterface, QueryRunner} from "typeorm";

export class addUsersTables1647712246485 implements MigrationInterface {
    name = 'addUsersTables1647712246485'

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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
            DROP TABLE "agencies"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."agencies_status_enum"
        `);
    }

}
