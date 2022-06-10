import { Point } from "geojson";
import { getRepository, Like, Not, Repository, TypeORMError } from "typeorm";
import { parseConfigFileTextToJson } from "typescript";
import { City } from "../entity/city.entity";
import { PlaceReview } from "../entity/place-reviews.entity";
import { Place } from "../entity/place.entity";
import {OperationalError} from "../utils/helpers/error";
import { PlaceInput } from "../utils/interfaces/place.interface";
import CityService from "./city.service";
import PhotoService from "./photo.service";
import PlaceReviewService from "./place-reviews.service";



export default class PlaceService {
    private placeRepository: Repository<Place>;
    private cityRepository: Repository<City>
    private placeReviewsService: PlaceReviewService
    private photoService: PhotoService
    constructor() {
        this.placeRepository = getRepository(Place)
        this.cityRepository = getRepository(City)
        this.placeReviewsService = new PlaceReviewService()
        this.photoService = new PhotoService()

    }

    async findAll(filters?: any): Promise<Array<Place>> {
        let places: Place[] = []
        if (filters.name) {
            places = (await this.placeRepository.find({ relations: ['city'], where: { name: Like(`${filters.name.toLowerCase()}%`) } }))
        }
        else {
            console.log('no query')
            console.log(places)
            places = await this.placeRepository.find({ relations: ['city'] })
        }
        for (let index = 0; index < places.length; index++) {
            places[index].placeReviews = await this.placeReviewsService.getPlaceReviews(places[index].id)
        }
        return places
    }


    async findOne(id: string): Promise<Place> {
        const place = await this.placeRepository.findOne(id, { relations: ['city'] })
        if (!place) throw new OperationalError('place is not found', 400)
        const returnedCityData = { id: place.city.id, name: place.city.name }
        const placeReviews = await this.placeReviewsService.getPlaceReviews(place.id)
        place.city = returnedCityData as City
        place.placeReviews = placeReviews
        return place
    }

    async create(input: PlaceInput): Promise<Place> {
        const existingPlaceWithUniqueData = await this.placeRepository.find({ where: [{ phoneNumber: input.phoneNumber }, { website: input.website }, { name: input.name }] });
        if (existingPlaceWithUniqueData.length > 0) throw new OperationalError('phone or website or name already exists', 400)
        const city = await this.cityRepository.findOne(input.cityId)
        if (!city) throw new OperationalError(`city of id ${input.cityId} does not exist`)
        delete input.cityId
        const photosUrls = await this.photoService.uploadPhotos(input.photos)
        input.photos = photosUrls
        const place = this.placeRepository.create({ ...input, city })
        return await this.placeRepository.save(place)
    }

    async update(id: string, input: PlaceInput): Promise<Place> {
        const existingPlace = await this.placeRepository.findOne(id)
        if (!existingPlace) throw new OperationalError(`there is no place of id ${id}`, 400)
        const city = await this.cityRepository.findOne(input.cityId)
        if (!city) throw new OperationalError(`city of id ${input.cityId} does not exist`)
        const existingPlacesWithUniqueData = await this.placeRepository.find({
            where: [{ name: input.name }, { website: input.website }, { phoneNumber: input.phoneNumber }]
        })
        existingPlacesWithUniqueData.filter(p => p.id !== existingPlace.id)
        if (existingPlacesWithUniqueData.length > 0) throw new OperationalError('website or name already exists', 400)
        return await this.placeRepository.save({ ...input, id: id })
    }

    async delete(id: string) {
        const existingPlace = await this.placeRepository.findOne(id)
        if (!existingPlace) throw new OperationalError(`place of id ${id} does not exist`, 400)
        await this.placeRepository.delete({ id })
    }


}