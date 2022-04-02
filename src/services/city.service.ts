import { Point } from "geojson";
import { getRepository, Repository, TypeORMError } from "typeorm";
import { CityPhotos } from "../entity/city-photos.entity";
import { City } from "../entity/city.entity";
import AppError from "../errors/error";
import { CityInput } from "../utils/interfaces/city.interface";



export default class CityService{
    private cityRepository: Repository<City>;
    constructor(){
        this.cityRepository = getRepository(City)
    }

    async findAll():Promise<Array<City>>{
        try{
            return await this.cityRepository.find()
        }
        catch(err){
            console.log(err)
            throw new Error(err)
        }
    }

    async findOne(id: string): Promise<City>{
        try{
            const city = await this.cityRepository.findOne(id)
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
            const existedCity = await this.cityRepository.find({where:[{name:input.name}, {weatherAPI: input.weatherAPI}]});
            console.log(existedCity)
            if(existedCity.length > 0) throw new AppError('weatherAPI or name already exists', 400)
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
    async update(id: string, ){
        //to be implemented
    }

    async delete(id: string){
            const existingCity = await this.cityRepository.findOne(id)
            if(!existingCity) throw new AppError(`city of id ${id} does not exist`, 400)
            const result =  await this.cityRepository.delete({id})
            console.log(result)
    }

}