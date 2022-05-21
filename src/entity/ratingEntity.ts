import {PrimaryGeneratedColumn, Column, ManyToOne, Entity} from "typeorm";
import { User } from "./user.entity";

export class RatingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    rating!: number;

    

}
