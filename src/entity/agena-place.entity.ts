import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove, BaseEntity, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Agenda } from "./agenda.entity";
import { City } from "./city.entity";
import { CommonEntity } from "./commonEntity";
import { Place } from "./place.entity";
import { RatingEntity } from "./ratingEntity";
import { Trip } from "./trip.entity";
import { User } from "./user.entity";


@Entity('agenda_places')
export class AgendaPlace{
  @ManyToOne(() => Agenda,  { primary: true })
  public agenda!: Agenda;

  @ManyToOne(() => Place,  { primary: true })
  public place!: Place;

  @Column({type: 'boolean', default: false})
  public isChecked!: boolean;
}
