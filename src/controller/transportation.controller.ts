import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import AppError from "../errors/error";
import CityService from "../services/city.service";
import TransportationService from "../services/transportation.service";
import { transportationCityFeesSchema } from "../utils/schemas/transportation.schema";

export class TransportationController {
    private transportationService: TransportationService
    constructor() {
        this.transportationService = new TransportationService()
        this.findAllTransportationMeans = this.findAllTransportationMeans.bind(this)
        this.createTransportationMean = this.createTransportationMean.bind(this)
        this.findOneTransportationMean = this.findOneTransportationMean.bind(this)
        this.updateTransportationMean = this.updateTransportationMean.bind(this)
        this.deleteTransportationMean = this.deleteTransportationMean.bind(this)
    }

    async findAllTransportationMeans(request: Request, response: Response, next: NextFunction) {
        try {
            const places = await this.transportationService.findAllTransportationMeans()
            console.log(places)
            return response.status(200).json({
                data: places
            })
        }
        catch (err) {

            return response.status(500).json({ err })
        }
    }

    async findOneTransportationMean(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params
            const transportationMean = await this.transportationService.findOneTransportationMean(id)
            response.status(200).json({
                data: transportationMean
            })
        } catch (err) {
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

    async createTransportationMean(request: Request, response: Response, next: NextFunction) {
        try {
            const { transportationType } = request.body
            if (!transportationType) throw new AppError('Please insert transportationType', 400)
            const transportationMean = await this.transportationService.createTransportationMean(transportationType)
            response.status(201).json({
                data: transportationMean
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

    async updateTransportationMean(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params
            const { transportationType } = request.body
            if (!transportationType) throw new AppError('Please insert transportationType', 400)
            const transportationMean = await this.transportationService.updateTransportationMean(id, transportationType)
            response.status(201).json({
                data: transportationMean
            })
        } catch (err) {
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

    async deleteTransportationMean(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params
            await this.transportationService.deleteTransportationMean(id)
            response.status(204).json({
                status: 'success'
            })

        } catch (err) {
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
    
    async createTransportationCityFees(request: Request, response: Response, next: NextFunction) {
        try {

            const { value, error } = transportationCityFeesSchema.validate(request.body)
            if (error) throw new AppError(error.message, 400)
            const transportationCityFees = await this.transportationService.createCityTransportationFees(value)
            response.status(201).json({
                data: transportationCityFees
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