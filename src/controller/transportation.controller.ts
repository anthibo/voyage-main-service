import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { OperationalError } from "../utils/helpers/error";
import CityService from "../services/city.service";
import TransportationService from "../services/transportation.service";
import { transportationCityFeesSchema } from "../utils/schemas/transportation.schema";
import { catcher } from "../utils/schemas/catcher";

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
            catcher(err, next)
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
            catcher(err, next)
        }

    }

    async createTransportationMean(request: Request, response: Response, next: NextFunction) {
        try {
            const { transportationType } = request.body
            if (!transportationType) throw new OperationalError('Please insert transportationType', 400)
            const transportationMean = await this.transportationService.createTransportationMean(transportationType)
            response.status(201).json({
                data: transportationMean
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async updateTransportationMean(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params
            const { transportationType } = request.body
            if (!transportationType) throw new OperationalError('Please insert transportationType', 400)
            const transportationMean = await this.transportationService.updateTransportationMean(id, transportationType)
            response.status(201).json({
                data: transportationMean
            })
        } catch (err) {
            catcher(err, next)
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
            catcher(err, next)
        }
    }

    async createTransportationCityFees(request: Request, response: Response, next: NextFunction) {
        try {

            const { value, error } = transportationCityFeesSchema.validate(request.body)
            if (error) throw new OperationalError(error.message, 400)
            const transportationCityFees = await this.transportationService.createCityTransportationFees(value)
            response.status(201).json({
                data: transportationCityFees
            })
        }
        catch (err) {
            catcher(err, next)
        }
    }

}