import { Entity, getRepository, Column, ManyToOne, BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { City } from "./city.entity";
import { Place } from "./place.entity";
import { ReviewsEntity } from "./reviewsEntity";
import { User } from "./user.entity";

@Entity('place_reviews')
export class PlaceReview extends ReviewsEntity {
    @ManyToOne(() => Place, place => place.placeReviews, {
        onDelete: 'CASCADE'
    })
    place!: Place

    @ManyToOne(() => User, user => user.placeReviews, {
        onDelete: 'CASCADE',
        eager: true
    })
    user: User
    
}
