import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index, OneToMany, ManyToOne, } from "typeorm";
import { CommonEntity } from "./commonEntity";
import { Point } from "geojson";
import { City } from "./city.entity";
import { PlaceRating } from "./place-ratings.entity";
import { PlaceReview } from "./place-reviews.entity";


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
    location!: Point

    @ManyToOne(() => City, city => city.places)
    city!: City

    @Column({type: 'simple-array'})
    photos: string[]

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

    @OneToMany(() => PlaceRating, placeRating => placeRating.place)
    userRatings: PlaceRating[]

    @OneToMany(() => PlaceReview, placeReview => placeReview.place, {eager: true})
    placeReviews: PlaceReview[]

    @BeforeInsert()
    async saveSmallCaseName(){
        this.name = this.name.toLowerCase()
    }

}
    