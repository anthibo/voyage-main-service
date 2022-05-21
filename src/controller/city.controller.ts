import { NextFunction, Request, Response } from "express";
import { Point } from "geojson"
import Joi from 'joi';
import { OperationalError } from "../utils/helpers/error";
import AuthService from '../services/auth.service'
import CityService from "../services/city.service";
import { validateIdParams } from "../utils/helpers/parameters.validator";
import { createCitySchema } from "../utils/schemas/city.schema";
import { catcher } from "../utils/helpers/catcher";
import CityRatingService from "../services/city-rating.service";
import { type } from "os";
import { isNumber } from "util";



export class CityController {
    private cityService: CityService
    private cityRatingService: CityRatingService
    constructor() {

        this.cityService = new CityService()
        this.cityRatingService = new CityRatingService()
        this.findAllCities = this.findAllCities.bind(this)
        this.createCity = this.createCity.bind(this)
        this.findOne = this.findOne.bind(this)
        this.deleteCity = this.deleteCity.bind(this)
        this.updateCity = this.updateCity.bind(this)
        this.addRatingToCity = this.addRatingToCity.bind(this)


    }

    async findAllCities(request: Request, response: Response, next: NextFunction) {
        try {
            const filters = request.query;
            const cities = await this.cityService.findAll(filters)
            return response.status(200).json({
                data: cities
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async findOne(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            validateIdParams(id)
            const city = await this.cityService.findOne(id)
            if (!city) throw new OperationalError('city not found', 400)
            const userRating = await this.cityRatingService.getUserRating({destinationId: city.id, userId: request.user.id})
            response.status(200).json({
                data: {...city, userRating}
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async createCity(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = createCitySchema.validate(request.body)
            if (error) {
                throw new OperationalError(error.message, 400)
            }
            const pointObject: Point = {
                type: "Point",
                coordinates: value.location
            }
            value.location = pointObject
            const createdCity = await this.cityService.create(value)
            response.status(201).json({
                status: 'success',
                data: createdCity
            })
        }
        catch (err) {
            catcher(err, next)

        }
    }
    async updateCity(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            validateIdParams(id)
            const { value, error } = createCitySchema.validate(request.body)
            if (error) {
                throw new OperationalError(error.message, 400)
            }
            const pointObject: Point = {
                type: "Point",
                coordinates: value.location
            }
            value.location = pointObject
            const updatedCity = await this.cityService.update(id, value)
            response.status(203).json({
                status: 'success',
                data: updatedCity
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async deleteCity(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            validateIdParams(id)
            await this.cityService.delete(id)
            response.status(204).json({
                status: 'success'
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async addRatingToCity(request: Request, response: Response, next: NextFunction) {
        try {
            const cityId = request.params.id
            validateIdParams(cityId)
            const { rating } = request.body
            const {value, error} = Joi.object({
                rating: Joi.number().required().max(5).min(0)
            }).validate(request.body)
            if(error) throw new OperationalError(error.message, 400)
            const { id: userId } = request.user
            const res = await this.cityRatingService.addRating({ destinationId: cityId, rating, userId })
            response.status(200).json({ message: 'added rating successfully' })
        }
        catch (err) {
            catcher(err, next)
        }

    }

}