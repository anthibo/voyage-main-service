import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate, getRepository} from "typeorm";
import { Place } from "./place.entity";
import { RatingEntity } from "./ratingEntity";
import { User } from "./user.entity";

@Entity('place_ratings')
export class PlaceRating extends RatingEntity {
    placeRepository = getRepository(Place)

    @ManyToOne(() => Place, place => place.userRatings)
    place!: Place 

    @ManyToOne(() => User, user => user)
    user: User

    @BeforeInsert()
    @BeforeUpdate()
    //TODO: fix update rating algo
    private async updateCityRating() {
        const cityId = this.place.id
        let place = await this.placeRepository.findOne(cityId, { relations: ['userRatings'] })
        console.log(this.rating)
        const rating = place.userRatings.length < 1 ? this.rating
            :
            place.userRatings.map(userRate => userRate.rating).reduce((prevRate, currentRate) => prevRate + currentRate, 0) + this.rating / place.userRatings.length + 1
        place.rating = rating
        place =  await this.placeRepository.save(place)
        this.place = place

    }
}
