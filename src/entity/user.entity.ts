import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany} from "typeorm";
import * as bcrypt from 'bcryptjs';
import { CommonEntity } from "./commonEntity";
import { RatingEntity } from "./ratingEntity";
import { CityRating } from "./city-ratings.entity";
import { PlaceRating } from "./place-ratings.entity";
import { CityReview } from "./city-reviews.entity";

export enum UserRole {
    ADMIN = "admin",
    USER = "normal_user",
  }
  export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = "inactive",
    BANNED = 'banned'
  }
@Entity('users')
export class User extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 55
    })
    firstName!: string;

    @Column({
        length: 55
    })
    lastName!: string;

    @Column({
        length: 55,
        unique: true
    })
    username!: string

    @Column()
    private password!: string

    @Column({
        unique: true
    })
    email!: string

    @Column({
        unique: true,
        nullable: true
    })
    phoneNumber?: string

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: string

    @Column(
        {
            type: "enum",
            enum: UserRole,
            default: UserRole.USER
        }
    )
    securityRole?: UserRole

    @OneToMany(() => CityRating, rating => rating.user )
    cityRatings: CityRating[];

    @OneToMany(() => PlaceRating, placeRating => placeRating.user )
    placeRatings: PlaceRating[];
    
    @OneToMany(() => CityReview, review => review.user )
    cityReviews: CityReview[];    


    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt);
    }

    async comparePassword(password: string): Promise<boolean>{
        return await bcrypt.compare(password, this.password)
    }
}
