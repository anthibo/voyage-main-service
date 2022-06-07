import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove, BaseEntity, PrimaryColumn, OneToMany } from "typeorm";
import { Agenda } from "./agenda.entity";
import { City } from "./city.entity";
import { CommonEntity } from "./commonEntity";
import { RatingEntity } from "./ratingEntity";
import { User } from "./user.entity";

export enum TripType{
    CUSTOMIZED = 'customized',
    GENERATED = 'generated'
}
@Entity('trips')
export class Trip extends CommonEntity {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.userTrips)
    user: User;

    @ManyToOne(() => City, city => city.cityTrips)
    city: City;

    @OneToMany(() => Agenda, agenda => agenda.trip)
    agendas: Agenda[];

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column({ type: 'enum', enum: TripType, default: TripType.CUSTOMIZED })
    type: TripType;
    
}
