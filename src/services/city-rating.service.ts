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
import CityReviewService from "./city-reviews.service";


export default class CityRatingService {
    private cityRepository: Repository<City>
    private cityRatingRepository: Repository<CityRating>;
    private userRepository: Repository<User>;
    private cityReviewService: CityReviewService
    constructor() {
        this.cityRepository = getRepository(City)
        this.cityRatingRepository = getRepository(CityRating)
        this.userRepository = getRepository(User)
        this.cityReviewService = new CityReviewService()

    }
    async addRating(ratingDTO: RatingDTO) {
        const {userId, destinationId, rating} = ratingDTO
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const city = await this.cityRepository.findOne(destinationId)
        if(!city) throw new OperationalError(`this entity of id ${destinationId} does not exists`)
        const existingRating = await this.cityRatingRepository.findOne({where: {city: city, user: user}, relations: ['user', 'city']})
        if(existingRating){
            existingRating.rating = rating
            return await this.cityRatingRepository.save(existingRating);
        }
        else{
            const newRating = new CityRating()
            newRating.city = city
            newRating.user = user
            newRating.rating = rating
            return await this.cityRatingRepository.save(newRating)
        }
    }
    async getUserRating({destinationId, userId}: RatingDTO): Promise<number> {
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const city = await this.cityRepository.findOne(destinationId)
        if(!city) throw new OperationalError(`this entity of id ${destinationId} does not exists`)
        const existingRating = await this.cityRatingRepository.findOne({where: {city: city, user: user}})
        if(!existingRating) return 0
        console.log(existingRating)
        return existingRating.rating
    }
    //TODO: only admin or user of the rating can delete the rating
    async deleteRating({destinationId, userId}: RatingDTO) {
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const city = await this.cityRepository.findOne(destinationId)
        if(!city) throw new OperationalError(`this entity of id ${destinationId} does not exists`)
        const existingRating = await this.cityRatingRepository.findOne({where: {city: city, user: user}})
        if(!existingRating) throw new OperationalError('this rating does not exist', 400)
        await this.cityRatingRepository.delete(existingRating.id)
    }
}