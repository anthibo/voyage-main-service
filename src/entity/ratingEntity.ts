import {PrimaryGeneratedColumn, Column} from "typeorm";

export abstract class ratingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    rating!: number;

}
