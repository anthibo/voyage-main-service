import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove, BaseEntity, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { City } from "./city.entity";
import { CommonEntity } from "./commonEntity";
import { Place } from "./place.entity";
import { RatingEntity } from "./ratingEntity";
import { Trip } from "./trip.entity";
import { User } from "./user.entity";


@Entity('trip_places')
export class TripPlace{
  @PrimaryColumn('uuid')
  id: string;
  
  @ManyToOne(() => Trip,  { primary: true })
  public trip!: Trip;

  @ManyToOne(() => Place,  { primary: true })
  public place!: Place;

  @Column({type: 'boolean', default: false})
  public isChecked!: boolean;
}
