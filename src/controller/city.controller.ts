import {NextFunction, Request, Response} from "express";
import { Point } from "geojson"
import Joi from 'joi';
import AppError from "../errors/error";
import AuthService from '../services/auth.service'
import CityService from "../services/city.service";

const createCitySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rating: Joi.number().min(0).max(5), 
    location: Joi.array().items(Joi.number().required()).length(2).required(),
    photos: Joi.array().items(Joi.string().uri()),
    weatherAPI: Joi.string().uri().required()

})
export class CityController {
    private cityService: CityService
    constructor() {

        this.cityService = new CityService()
        this.findAllCities = this.findAllCities.bind(this)
        this.createCity = this.createCity.bind(this)
        this.findOne = this.findOne.bind(this)
        this.deleteCity = this.deleteCity.bind(this)

    }
    
    async findAllCities(request: Request, response: Response, next: NextFunction) {
        try{
           const cities = await this.cityService.findAll()
           console.log(cities)
           return response.status(200).json({
               data: cities
           })
        }
        catch(err){
            console.log(err)
           return response.status(500).json(err)
        }  
    }
    async findOne(request: Request, response: Response, next: NextFunction){
        try{
        const id = request.params.id
        const city = await this.cityService.findOne(id)
        if(!city) throw new AppError('city not found', 400)
        response.status(200).json({
            data:city
        })
        }
        catch(err){
            if(err instanceof AppError){
                return response.status(err.statusCode).json({
                     status: 'failed',
                     message: err.message
                 })
             }
             else{
                 console.log(err)
                 return response.status(500).json({
                     status: 'failed',
                     err
                 })}
                }
    }

    async createCity(request: Request, response: Response, next: NextFunction){
        try{
            const {value, error} = createCitySchema.validate(request.body)
            if(error){
                throw new AppError(error.message,400)
            }
            const pointObject: Point = {
                type:"Point",
                coordinates: value.location
            } 
            value.location = pointObject
            const createdCity = await this.cityService.create(value)
            response.status(201).json({
                status: 'success',
                data: createdCity
            })
        }
        catch(err){
            if(err instanceof AppError){
               return response.status(err.statusCode).json({
                    status: 'failed',
                    message: err.message
                })
            }
            else{
                console.log(err)
                return response.status(500).json({
                    status: 'failed',
                    err
                })}
            
        }
    }
    async deleteCity(request: Request, response: Response, next: NextFunction){
        try{
        const id = request.params.id
        await this.cityService.delete(id)
        response.status(204).json({
            status: 'success'
        })
        }
        catch(err){
            if(err instanceof AppError){
                response.status(err.statusCode).json({
                    status: 'fail',
                    message: err.message
                })
            }
            else{
                console.log(err)
                response.status(500).json({
                    status: 'fail',
                    err
                })
            }
            
        }
    }
}