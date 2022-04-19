import { NextFunction, Request, Response } from "express";
import { Point } from "geojson"
import AppError from "../errors/error";
import PlaceService from "../services/place.service";
import { validateIdParams } from "../utils/helpers/parameters.validator";
import { placeInputSchema } from "../utils/schemas/place.schema";


export class PlaceController {
    private placeService: PlaceService
    constructor() {

        this.placeService = new PlaceService()
        this.findAllPlaces = this.findAllPlaces.bind(this)
        this.findAllPlaces = this.findAllPlaces.bind(this)
        this.createPlace = this.createPlace.bind(this)
        this.findOne = this.findOne.bind(this)
        this.deletePlace = this.deletePlace.bind(this)
        this.updatePlace = this.updatePlace.bind(this)


    }

    async findAllPlaces(request: Request, response: Response, next: NextFunction) {
        try {
            const places = await this.placeService.findAll()
            console.log(places)
            return response.status(200).json({
                data: places
            })
        }
        catch (err) {
            console.log(err)
            return response.status(500).json(err)
        }
    }

    async findOne(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            const place = await this.placeService.findOne(id)
            if (!place) throw new AppError('place not found', 400)
            response.status(200).json({
                data: place
            })
        }
        catch (err) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({
                    status: 'failed',
                    message: err.message
                })
            }
            else {
                console.log(err)
                return response.status(500).json({
                    status: 'failed',
                    err
                })
            }
        }
    }

    async createPlace(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = placeInputSchema.validate(request.body)
            if (error) {
                throw new AppError(error.message, 400)
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
            console.log(err)
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({
                    status: 'failed',
                    message: err.message
                })
            }
            else {
                console.log(err)
                return response.status(500).json({
                    status: 'failed',
                    err
                })
            }

        }
    }
    async updatePlace(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            validateIdParams(id)
            const { value, error } = placeInputSchema.validate(request.body)
            if (error) {
                throw new AppError(error.message, 400)
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
            if (err instanceof AppError) {
                response.status(err.statusCode).json({
                    status: 'fail',
                    message: err.message
                })
            }
            else {
                console.log(err)
                response.status(500).json({
                    status: 'fail',
                    err
                })
            }
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
            if (err instanceof AppError) {
                response.status(err.statusCode).json({
                    status: 'fail',
                    message: err.message
                })
            }
            else {
                console.log(err)
                response.status(500).json({
                    status: 'fail',
                    err
                })
            }

        }
    }
}