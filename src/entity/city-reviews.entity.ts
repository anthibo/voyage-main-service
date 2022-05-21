import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { City } from "./city.entity";
import { ReviewsEntity } from "./reviewsEntity";
import { User } from "./user.entity";

@Entity('city_reviews')
export class CityReview extends ReviewsEntity {
    cityRepository = getRepository(City)
    @ManyToOne(() => City, city => city.reviews, {
        onDelete: 'CASCADE'
    })
    city!: City

    @ManyToOne(() => User, user => user.cityReviews, {
        onDelete: 'CASCADE'
    })
    user: User
    
}
