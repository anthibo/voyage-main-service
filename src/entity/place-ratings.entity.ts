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
    private async updatePlaceRating() {
        const cityId = this.place.id
        let place = await this.placeRepository.findOne(cityId, { relations: ['userRatings'] })
        console.log(this.rating)
        const placeRatingsWithoutCurrentUser = place.userRatings.filter(rating => rating.user !== this.user)
        place.rating = (place.rating * placeRatingsWithoutCurrentUser.length + this.rating) / (placeRatingsWithoutCurrentUser.length + 1)
        await this.placeRepository.save(place)

    }
}
