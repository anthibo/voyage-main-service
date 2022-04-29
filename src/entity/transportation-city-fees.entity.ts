import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
import { City } from "./city.entity";
import { CommonEntity } from "./commonEntity";
import { TransportationMeans } from "./transportation-means.entity";

@Entity('transportation_city_fees')
export class TransportationCityFees extends CommonEntity {
    @ManyToOne(() => TransportationMeans, transportationMean => transportationMean.transportationCityFees, {primary: true})
    @JoinColumn({name: 'transportation_id'})
    transportationMean: TransportationMeans

    @ManyToOne(() => City, city => city.transportationCityFees, {primary: true})
    @JoinColumn({name: 'city_id'})
    city: City

    @Column({name: 'km_cost'})
    kmCost: number

}
