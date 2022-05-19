import { BaseEntity, getRepository, Repository, TypeORMError } from "typeorm";
import { City } from "../entity/city.entity";
import { TransportationMeans } from '../entity/transportation-means.entity';
import { TransportationCityFees } from '../entity/transportation-city-fees.entity';
import { OperationalError } from "../utils/helpers/error";
import { TransportationCityFeesInput } from "../utils/interfaces/transportation.interface";
import { CityRating } from "../entity/city-ratings.entity";
import { RatingEntity } from "../entity/ratingEntity";
import { type } from "os";
import { Place } from "../entity/place.entity";
import { User } from "../entity/user.entity";
import { RatingDTO } from "../utils/interfaces/rating.dto";
import { CityReview } from "../entity/city-reviews.entity";
import { ReviewDTO } from "../utils/interfaces/review.dto";
import { uploadToCloud } from "../utils/helpers/cloudinary";


export default class PhotoService {
    constructor() {

    }
    async uploadPhotos(photos: string[]) {
        const photosURLs = [] as Array<string>
        for (const photo of photos) {
            const response = await uploadToCloud(photo)
            photosURLs.push(response.url) 
        }
        return photosURLs
    }

}