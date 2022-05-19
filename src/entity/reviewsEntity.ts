import {PrimaryGeneratedColumn, Column, ManyToOne, Entity} from "typeorm";
import { User } from "./user.entity";

export class ReviewsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    review!: string;

    @Column({type: 'simple-array'})
    photos: string[]

    

}
