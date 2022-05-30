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
import PhotoService from "./photo.service";


export default class CityReviewService {
    private cityRepository: Repository<City>
    private cityReviewRepository: Repository<CityReview>;
    private userRepository: Repository<User>;
    private photoService: PhotoService
    constructor() {
        this.photoService = new PhotoService()
        this.cityRepository = getRepository(City)
        this.cityReviewRepository = getRepository(CityReview)
        this.userRepository = getRepository(User)

    }
    async addReview(reviewDTO: ReviewDTO) {
        const {review, destinationId, photos, userId} = reviewDTO
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const city = await this.cityRepository.findOne(destinationId)
        if(!city) throw new OperationalError(`this entity of id ${destinationId} does not exists`)        
        const photosUrls = await this.photoService.uploadPhotos(photos)
        const cityReview = new CityReview()
        cityReview.city = city
        cityReview.photos = photosUrls
        cityReview.review = review
        cityReview.user = user
        const createdReview =  await this.cityReviewRepository.save(cityReview)
        return createdReview
    }
    async getCityReviews(cityId: string): Promise<Array<CityReview>>{
        const city = await this.cityRepository.findOne(cityId)
        if(!city) throw new OperationalError(`this entity of id ${cityId} does not exists`)
        let reviews = await this.cityReviewRepository.find({where: {city}, relations: ['user']})
        reviews = reviews.map(review => ({...review, user: {id: review.user.id, firstName: review.user.firstName, lastName: review.user.lastName}})) as CityReview[]
        return reviews
    }
    async editReview(ratingDTO: ReviewDTO){

    }
    //TODO: only admin or user of the rating can delete the rating
    async deleteReview({id, userId}: ReviewDTO, role: string) {
        if(role === 'admin' )return await this.cityReviewRepository.delete({id})
        const user = await this.userRepository.findOne(userId)
        const existingReview = await this.cityReviewRepository.findOne({user, id})
        if(!existingReview) throw new OperationalError(`not authorized to delete this review`)
        console.log('deleting...')
        return await this.cityReviewRepository.delete(id)
    }
}