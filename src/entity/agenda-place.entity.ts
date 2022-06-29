import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove, BaseEntity, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Agenda } from "./agenda.entity";
import { Place } from "./place.entity";


@Entity('agenda_places')
export class AgendaPlace{
  @ManyToOne(() => Agenda,  { primary: true })
  public agenda!: Agenda;

  @ManyToOne(() => Place,  { primary: true, eager: true },)
  public place!: Place;
}