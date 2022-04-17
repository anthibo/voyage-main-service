import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index, OneToMany,} from "typeorm";
import { CommonEntity } from "./commonEntity";
import { Point } from "geojson";
import { CityPhoto } from "./city-photos.entity";
import { Place } from "./place.entity";


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
        name:'weather_api',
        unique: true

    })
    weatherAPI?:string;

    @Column({
        default: 4
    })
    rating: number;

    @Index({ spatial: true })
    @Column({
      type: 'geography',
      spatialFeatureType: 'Point', 
      srid: 4326,
    })
    location!:Point

    @OneToMany(() => CityPhoto, photo => photo.city )
    photos?: CityPhoto[]

    @OneToMany(() => Place, place => place.city)
    places: Place[]
    
}
