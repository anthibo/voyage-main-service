import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { CommonEntity } from "./commonEntity";
import { TransportationCityFees } from "./transportation-city-fees.entity";

@Entity('transportation_means')
export class TransportationMeans extends CommonEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({
        unique: true,
        length: 55
    })
    transportationType!: string 

    @OneToMany(() => TransportationCityFees, transportationCityFees => transportationCityFees.transportationMean)
    transportationCityFees?: TransportationCityFees
}
