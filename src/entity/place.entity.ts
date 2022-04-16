import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index, OneToMany, ManyToOne, } from "typeorm";
import { CommonEntity } from "./commonEntity";
import { Point } from "geojson";
import { PlacePhoto } from "./place-photos.entity";
import { City } from "./city.entity";


@Entity('places')
export class Place extends CommonEntity {
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
        default: 4
    })
    rating: number;

    @Index({ spatial: true })
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location!: Point

    @ManyToOne(() => City, city => city.places)
    city!: City

    @OneToMany(() => PlacePhoto, photo => photo.place)
    photos?: PlacePhoto[]

    @Column({
        unique: true,
        nullable: true
    })
    phoneNumber: string

    @Column({
        unique: true,
        nullable: true
    })
    website: string

    @Column({
        name: 'activity_type'
    })
    activityType: string

    @Column({
        default: 0
    })
    price: number

}
