import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove, BaseEntity, PrimaryColumn, OneToMany } from "typeorm";
import { AgendaPlace } from "./agena-place.entity";
import { City } from "./city.entity";
import { CommonEntity } from "./commonEntity";
import { RatingEntity } from "./ratingEntity";
import { Trip } from "./trip.entity";
import { User } from "./user.entity";


@Entity('agendas')
export class Agenda{
    @PrimaryColumn('uuid')
    id: string;

    @Column({type: 'date'})
    day:Date

    @ManyToOne(() => Trip, trip => trip.agendas)
    trip: Trip;
    
    @OneToMany(() => AgendaPlace, agendaPlace => agendaPlace.agenda)
    agendaPlaces: AgendaPlace[];
}
