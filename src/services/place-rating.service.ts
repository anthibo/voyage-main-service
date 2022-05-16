import { BaseEntity, getRepository, Repository, TypeORMError } from "typeorm";
import { OperationalError } from "../utils/helpers/error";
import { TransportationCityFeesInput } from "../utils/interfaces/transportation.interface";
import { RatingEntity } from "../entity/ratingEntity";
import { Place } from "../entity/place.entity";
import { User } from "../entity/user.entity";
import { RatingDTO } from "../utils/interfaces/rating.dto";
import { PlaceRating } from "../entity/place-ratings.entity";


export default class PlaceRatingService {
    private placeRepository: Repository<Place>
    private placeRatingRepository: Repository<PlaceRating>;
    private userRepository: Repository<User>;
    constructor() {
        this.placeRepository = getRepository(Place)
        this.placeRatingRepository = getRepository(PlaceRating)
        this.userRepository = getRepository(User)

    }
    async addRating(ratingDTO: RatingDTO) {
        const {userId, destinationId, rating} = ratingDTO
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const place = await this.placeRepository.findOne(destinationId)
        if(!place) throw new OperationalError(`this entity of id ${destinationId} does not exists`)
        const existingRating = await this.placeRatingRepository.findOne({where: {place: place, user: user}, relations: ['user', 'place']})
        if(existingRating){
            // update rating
            existingRating.rating = rating
            return await this.placeRatingRepository.save(existingRating);
        }
        else{
            const newRating = new PlaceRating()
            newRating.place = place
            newRating.user = user
            newRating.rating = rating
            return await this.placeRatingRepository.save(newRating)
        }
    }
    async getUserRating({destinationId, userId}: RatingDTO): Promise<number> {
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const place = await this.placeRepository.findOne(destinationId)
        if(!place) throw new OperationalError(`this entity of id ${destinationId} does not exists`)
        const existingRating = await this.placeRatingRepository.findOne({where: {place: place, user: user}})
        if(!existingRating) return 0
        console.log(existingRating)
        return existingRating.rating
    }
    //TODO: only admin or user of the rating can dxelete the rating
    async deleteRating({destinationId, userId}: RatingDTO) {
        const user = await this.userRepository.findOne(userId)
        if(!user) throw new OperationalError(`user of id ${userId} does not exists`)
        const place = await this.placeRepository.findOne(destinationId)
        if(!place) throw new OperationalError(`this entity of id ${destinationId} does not exists`)
        const existingRating = await this.placeRatingRepository.findOne({where: {place: place, user: user}})
        if(!existingRating) throw new OperationalError('this rating does not exist', 400)
        await this.placeRatingRepository.delete(existingRating.id)
    }
}