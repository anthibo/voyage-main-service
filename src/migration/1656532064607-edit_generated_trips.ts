import {MigrationInterface, QueryRunner} from "typeorm";

export class editGeneratedTrips1656532064607 implements MigrationInterface {
    name = 'editGeneratedTrips1656532064607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "agendas" (
                "id" uuid NOT NULL,
                "day" integer NOT NULL,
                "tripId" uuid,
                CONSTRAINT "PK_5fea8668c8712b8292ded824549" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "agenda_places" (
                "agendaId" uuid NOT NULL,
                "placeId" uuid NOT NULL,
                CONSTRAINT "PK_b98fce419a697b27d700a8aced4" PRIMARY KEY ("agendaId", "placeId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "trips" DROP COLUMN "startDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "trips" DROP COLUMN "endDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "agendas"
            ADD CONSTRAINT "FK_f3d4c32f6218ea43271bf27af92" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "agenda_places"
            ADD CONSTRAINT "FK_ef66f0c92d8639012864c8be64c" FOREIGN KEY ("agendaId") REFERENCES "agendas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "agenda_places"
            ADD CONSTRAINT "FK_00f146b4ee9bb0788fc48edbe8e" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "agenda_places" DROP CONSTRAINT "FK_00f146b4ee9bb0788fc48edbe8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "agenda_places" DROP CONSTRAINT "FK_ef66f0c92d8639012864c8be64c"
        `);
        await queryRunner.query(`
            ALTER TABLE "agendas" DROP CONSTRAINT "FK_f3d4c32f6218ea43271bf27af92"
        `);
        await queryRunner.query(`
            ALTER TABLE "trips"
            ADD "endDate" date NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "trips"
            ADD "startDate" date NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "agenda_places"
        `);
        await queryRunner.query(`
            DROP TABLE "agendas"
        `);
    }

}
