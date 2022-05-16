import { NextFunction, Request, Response } from "express";
import { Point } from "geojson"
import { OperationalError } from "../utils/helpers/error";
import PlaceService from "../services/place.service";
import { validateIdParams } from "../utils/helpers/parameters.validator";
import { placeInputSchema } from "../utils/schemas/place.schema";
import { catcher } from "../utils/helpers/catcher";
import Joi from "joi";
import PlaceRatingService from "../services/place-rating.service";


export class PlaceController {
    private placeService: PlaceService
    private placeRatingService: PlaceRatingService
    constructor() {

        this.placeService = new PlaceService()
        this.placeRatingService = new PlaceRatingService
        this.findAllPlaces = this.findAllPlaces.bind(this)
        this.findAllPlaces = this.findAllPlaces.bind(this)
        this.createPlace = this.createPlace.bind(this)
        this.findOne = this.findOne.bind(this)
        this.deletePlace = this.deletePlace.bind(this)
        this.updatePlace = this.updatePlace.bind(this)
        this.addRatingToPlace = this.addRatingToPlace.bind(this)
    }

    async findAllPlaces(request: Request, response: Response, next: NextFunction) {
        try {
            const filters = request.query;
            const places = await this.placeService.findAll(filters)
            return response.status(200).json({
                data: places
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async findOne(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            const place = await this.placeService.findOne(id)
            if (!place) throw new OperationalError('place not found', 400)
            const userRating = await this.placeRatingService.getUserRating({destinationId: id, userId: request.user.id})
            response.status(200).json({
                data: {...place, userRating}
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async createPlace(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = placeInputSchema.validate(request.body)
            if (error) {
                throw new OperationalError(error.message, 400)
            }
            const pointObject: Point = {
                type: "Point",
                coordinates: value.location
            }
            value.location = pointObject
            const createdCity = await this.placeService.create(value)
            response.status(201).json({
                status: 'success',
                data: createdCity
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async updatePlace(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            validateIdParams(id)
            const { value, error } = placeInputSchema.validate(request.body)
            if (error) {
                throw new OperationalError(error.message, 400)
            }
            const pointObject: Point = {
                type: "Point",
                coordinates: value.location
            }
            value.location = pointObject
            const updatedCity = await this.placeService.update(id, value)
            response.status(203).json({
                status: 'success',
                data: updatedCity
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async deletePlace(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            await this.placeService.delete(id)
            response.status(204).json({
                status: 'success'
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async addRatingToPlace(request: Request, response: Response, next: NextFunction) {
        try {
            const placeId = request.params.id
            validateIdParams(placeId)
            const { rating } = request.body
            const {value, error} = Joi.object({
                rating: Joi.number().required().max(5).min(0)
            }).validate(request.body)
            if(error) throw new OperationalError(error.message, 400)
            const { id: userId } = request.user
            const res = await this.placeRatingService.addRating({ destinationId: placeId, rating, userId })
            response.status(200).json({ message: 'added rating successfully' })
        }
        catch (err) {
            catcher(err, next)
        }

    }
}