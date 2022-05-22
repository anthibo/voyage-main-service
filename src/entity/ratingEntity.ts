import {PrimaryGeneratedColumn, Column, ManyToOne, Entity} from "typeorm";

export class RatingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'float'})
    rating!: number;

    

}
