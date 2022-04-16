import { Point } from "geojson";
import { getRepository, Not, Repository, TypeORMError } from "typeorm";
import { parseConfigFileTextToJson } from "typescript";
import { City } from "../entity/city.entity";
import { Place } from "../entity/place.entity";
import AppError from "../errors/error";
import { PlaceInput } from "../utils/interfaces/place.interface";
import CityService from "./city.service";



export default class PlaceService {
    private placeRepository: Repository<Place>;
    private cityRepository: Repository<City>
    constructor() {
        this.placeRepository = getRepository(Place)
        this.cityRepository = getRepository(City)
    }

    async findAll(): Promise<Array<Place>> {

        return await this.placeRepository.find({ relations: ['photos'] })
    }

    async findAllCityPlaces(cityId: string): Promise<Array<Place>> {
        console.log(cityId)
        const city = await this.cityRepository.findOne(cityId)
        if (!city) throw new AppError(`city of id ${cityId} does not exist`)
        const places = await this.placeRepository.createQueryBuilder('place')
            .leftJoinAndSelect('place.city', 'cities', 'cities.id = :id', { id: cityId })
            .getMany()
        //const places = await this.placeRepository.find({where:{city}})
        return places
    }

    async findOne(id: string): Promise<Place> {
        const place = await this.placeRepository.findOne(id, { relations: ['photos'] })
        if (!place) throw new AppError('place is not found', 400)
        return place
    }

    async create(input: PlaceInput): Promise<Place> {
        const existingPlaceWithUniqueData = await this.placeRepository.find({ where: [{ phoneNumber: input.phoneNumber }, { website: input.website }, { name: input.name }] });
        if (existingPlaceWithUniqueData.length > 0) throw new AppError('phone or website or name already exists', 400)
        const city = await this.cityRepository.findOne(input.cityId)
        if (!city) throw new AppError(`city of id ${input.cityId} does not exist`)
        delete input.cityId
        const place = this.placeRepository.create({ ...input, city })
        return await this.placeRepository.save(place)
    }
    async update(id: string, input: PlaceInput): Promise<Place> {
        const existingPlace = await this.placeRepository.findOne(id)
        if (!existingPlace) throw new AppError(`there is no place of id ${id}`, 400)
        const city = await this.cityRepository.findOne(input.cityId)
        if (!city) throw new AppError(`city of id ${input.cityId} does not exist`)
        const existingPlacesWithUniqueData = await this.placeRepository.find({
            where: [{ name: input.name }, { website: input.website }, { phoneNumber: input.phoneNumber }]
        })
        existingPlacesWithUniqueData.filter(p => p.id !== existingPlace.id)
        if (existingPlacesWithUniqueData.length > 0) throw new AppError('weatherAPI or name already exists', 400)
        return await this.placeRepository.save({ ...input, id: id })
    }

    async delete(id: string) {
        const existingPlace = await this.placeRepository.findOne(id)
        if (!existingPlace) throw new AppError(`place of id ${id} does not exist`, 400)
        const result = await this.placeRepository.delete({ id })
    }


}