import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index, OneToMany, OneToOne,} from "typeorm";
import { CommonEntity } from "./commonEntity";
import { Point } from "geojson";
import { Place } from "./place.entity";
import { TransportationCityFees } from "./transportation-city-fees.entity";
import { CityRating } from "./city-ratings.entity";
import { CityReview } from "./city-reviews.entity";
import { Trip } from "./trip.entity";


@Entity('cities')
export class City extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 55,
        unique: true
    })
    name!: string;

    @Column({
        nullable: false
    })
    description!: string;

    @Column({
        default: 4,
        type: 'float4'
    })
    rating: number;

    @Index({ spatial: true })
    @Column({
      type: 'geography',
      spatialFeatureType: 'Point', 
      srid: 4326,
    })
    location!:Point

    @Column({type: 'simple-array'})
    photos: string[]


    @OneToMany(() => Place, place => place.city)
    places: Place[]

    @OneToMany(() => TransportationCityFees, transportationCityFees => transportationCityFees.city)
    transportationCityFees: TransportationCityFees
    
    @OneToMany(() => CityRating, cityRating => cityRating.city)
    userRatings: CityRating[]

    @OneToMany(() => CityReview, cityReview => cityReview.city, {eager: true})
    cityReviews: CityReview[]

    @OneToMany(() => Trip, cityTrip => cityTrip.city)
    cityTrips: Trip[]

    @BeforeInsert()
    async saveSmallCaseName(){
        this.name = this.name.toLowerCase()
    }
}
