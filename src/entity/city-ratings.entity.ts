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
        const rating = city.userRatings.length < 1 ? this.rating
            :
            city.userRatings.map(userRate => userRate.rating).reduce((prevRate, currentRate) => prevRate + currentRate, 0) + this.rating / city.userRatings.length + 1
        city.rating = rating
        city =  await this.cityRepository.save(city)
        this.city = city

    }
    
}
