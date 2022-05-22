import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { City } from "./city.entity";
import { ReviewsEntity } from "./reviewsEntity";
import { User } from "./user.entity";

@Entity('place_reviews')
export class PlaceReview extends ReviewsEntity {
    @ManyToOne(() => City, city => city.cityReviews, {
        onDelete: 'CASCADE'
    })
    city!: City

    @ManyToOne(() => User, user => user.cityReviews, {
        onDelete: 'CASCADE'
    })
    user: User
    
}
