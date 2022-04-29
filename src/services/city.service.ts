import { Point } from "geojson";
import { getRepository, Repository, Like } from "typeorm";
import { CityPhoto } from "../entity/city-photos.entity";
import { City } from "../entity/city.entity";
import AppError from "../errors/error";
import { CityInput } from "../utils/interfaces/city.interface";



export default class CityService{
    private cityRepository: Repository<City>;
    constructor(){
        this.cityRepository = getRepository(City)
    }

    async findAll(filters?: any):Promise<Array<City>>{
        try{
            if(filters.name) return await this.cityRepository.find({relations: ['places', 'photos'], where: {name: Like(`${filters.name}%`)}})
            return await this.cityRepository.find({relations: ['places', 'photos']})
        }
        catch(err){
            console.log(err)
            throw new Error(err)
        }
    }

    async findOne(id: string): Promise<City>{
        try{
            const city = await this.cityRepository.findOne(id,{relations: ['places', 'photos']})
            if(!city) throw new AppError('city is not found', 400)
            return city
        }
        catch(err){
            if(err instanceof AppError){
                throw new AppError(err.message, err.statusCode)
            }
            console.log(err)
            throw new Error(err)
        }

    }

    async create(input: CityInput): Promise<City>{
        try{
            const existingCity = await this.cityRepository.find({where:[{name:input.name}, {weatherAPI: input.weatherAPI}]} );
            console.log(existingCity)
            if(existingCity.length > 0) throw new AppError('weatherAPI or name already exists', 400)
            const city =  this.cityRepository.create(input)
            return await this.cityRepository.save(city)
        }
        catch(err){
            if(err instanceof AppError){
                throw new AppError(err.message, err.statusCode)
            }
            console.log(err)
            throw new Error(err)
        }
        
    }
    async update(id: string, input: CityInput): Promise<City>{
        const existingCity = this.cityRepository.findOne(id)
        if(!existingCity) throw new AppError(`there is no city of id ${id}`, 400)
        const existingCitiesWithNameOrWeatherAPI = await this.cityRepository
        .createQueryBuilder("city")
        .select()
        .   where('city.id != :id',{id})
        .where('city.name =:name', {name: input.name})
        .orWhere('city.weatherAPI =:api', {api: input.weatherAPI})
        .getMany()
        if(existingCitiesWithNameOrWeatherAPI.length > 0) throw new AppError('weatherAPI or name already exists', 400)
        return await this.cityRepository.save({...input, id:id })
    }

    async delete(id: string){
            const existingCity = await this.cityRepository.findOne(id)
            if(!existingCity) throw new AppError(`city of id ${id} does not exist`, 400)
            const result =  await this.cityRepository.delete({id})
            console.log(result)
    }

}