import {PrimaryGeneratedColumn, Column, ManyToOne, Entity} from "typeorm";
import { CommonEntity } from "./commonEntity";
import { User } from "./user.entity";

export class ReviewsEntity extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    review!: string;

    // @Column({type: 'simple-array'})
    // photos: string[]

    

}
