import { BaseEntity, getRepository, Repository, TypeORMError } from "typeorm";

import { OperationalError } from "../utils/helpers/error";
import { TransportationCityFeesInput } from "../utils/interfaces/transportation.interface";
import { CityRating } from "../entity/city-ratings.entity";
import { RatingEntity } from "../entity/ratingEntity";
import { type } from "os";
import { Place } from "../entity/place.entity";
import { User } from "../entity/user.entity";
import { RatingDTO } from "../utils/interfaces/rating.dto";
import { ReviewDTO } from "../utils/interfaces/review.dto";
import PhotoService from "./photo.service";
import { PlaceReview } from "../entity/place-reviews.entity";


export default class PlaceReviewService {
    private placeRepository: Repository<Place>
    private placeReviewRepository: Repository<PlaceReview>;
    private userRepository: Repository<User>;
    private photoService: PhotoService
    constructor() {
        this.photoService = new PhotoService()
        this.placeRepository = getRepository(Place)
        this.placeReviewRepository = getRepository(PlaceReview)
        this.userRepository = getRepository(User)

    }
    async addReview(reviewDTO: ReviewDTO) {
        const {review, destinationId, photos, userId} = reviewDTO
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const place = await this.placeRepository.findOne(destinationId)
        if(!place) throw new OperationalError(`this entity of id ${destinationId} does not exists`)        
        const photosUrls = await this.photoService.uploadPhotos(photos)
        const placeReview = new PlaceReview()
        placeReview.place = place
        placeReview.photos = photosUrls
        placeReview.review = review
        placeReview.user = user
        const createdReview =  await this.placeReviewRepository.save(placeReview)
        return createdReview
    }
    async getPlaceReviews(cityId: string): Promise<Array<PlaceReview>>{
        const place = await this.placeRepository.findOne(cityId)
        if(!place) throw new OperationalError(`this entity of id ${cityId} does not exists`)
        const reviews = await this.placeReviewRepository.find({where: {city: place}})
        console.log(reviews)
        return reviews
    }
    async editReview(ratingDTO: ReviewDTO){

    }
    async deleteReview({id, userId}: ReviewDTO, role: string) {
        if(role === 'admin' )return await this.placeReviewRepository.delete({id})
        const user = await this.userRepository.findOne(userId)
        const existingReview = await this.placeReviewRepository.findOne({user, id})
        if(!existingReview) throw new OperationalError(`not authorized to delete this review`)
        console.log('deleting...')
        return await this.placeReviewRepository.delete(id)
    }
}