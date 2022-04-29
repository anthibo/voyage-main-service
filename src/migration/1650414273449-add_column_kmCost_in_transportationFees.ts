import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnKmCostInTransportationFees1650414273449 implements MigrationInterface {
    name = 'addColumnKmCostInTransportationFees1650414273449'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "transportation_city_fees"
            ADD CONSTRAINT "FK_107e27892aca882c01d2cbe8a3d" FOREIGN KEY ("transportation_id") REFERENCES "transportation_means"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees"
            ADD CONSTRAINT "FK_d93ec3ba4dbf64a881519ccfd9b" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees" DROP CONSTRAINT "FK_d93ec3ba4dbf64a881519ccfd9b"
        `);
        await queryRunner.query(`
            ALTER TABLE "transportation_city_fees" DROP CONSTRAINT "FK_107e27892aca882c01d2cbe8a3d"
        `);
        await queryRunner.query(`
            DROP TABLE "transportation_city_fees"
        `);
        await queryRunner.query(`
            DROP TABLE "transportation_means"
        `);
    }

}
