import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { City } from "./city.entity";
import { RatingEntity } from "./ratingEntity";
import { User } from "./user.entity";

@Entity('city_ratings')
export class CityRating extends RatingEntity {
    cityRepository = getRepository(City)
    @ManyToOne(() => City, city => city.userRatings, {
        onDelete: 'CASCADE'
    })
    city!: City

    @ManyToOne(() => User, user => user, {
        onDelete: 'CASCADE'
    })
    user: User

    @BeforeInsert()
    @BeforeUpdate()
    //TODO: fix update rating algo
    private async updateCityRating() {
        const cityId = this.city.id
        let city = await this.cityRepository.findOne(cityId, { relations: ['userRatings'] })
        console.log(this.rating)
        const cityRatingsWithoutCurrentUser = city.userRatings.filter(rating => rating.user !== this.user)
        city.rating = (city.rating * cityRatingsWithoutCurrentUser.length + this.rating) / (cityRatingsWithoutCurrentUser.length + 1)
        await this.cityRepository.save(city)
    }
    
}
