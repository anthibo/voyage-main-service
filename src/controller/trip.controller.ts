import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import { OperationalError } from "../utils/helpers/error";
import { catcher } from "../utils/helpers/catcher";
import TripService from "../services/trip.service";
import { placeTripSchema, createCustomizedTripSchema } from "../utils/schemas/trip.schema";
import { validateIdParams } from "../utils/helpers/parameters.validator";

export class TripController {

    private userService: UserService
    private tripService: TripService
    constructor() {
        this.userService = new UserService();
        this.listAllUserTrips = this.listAllUserTrips.bind(this)
        this.listNotAddedPlaceTrips = this.listNotAddedPlaceTrips.bind(this)
        this.tripService = new TripService()
        this.createCustomizedTrip = this.createCustomizedTrip.bind(this)
        this.updateCustomizedTrip = this.updateCustomizedTrip.bind(this)
        this.getTrip = this.getTrip.bind(this)
        this.deleteTrip = this.deleteTrip.bind(this)
        this.addPlaceToTrip = this.addPlaceToTrip.bind(this)
        this.deletePlaceFromTrip = this.deletePlaceFromTrip.bind(this)
        
    }

    async listAllUserTrips(req: Request, res: Response, next: NextFunction) {
        try {
            const trips = await this.tripService.findAllUserTrips(req.user.id)
            res.json(trips)
        }
        catch (err) {
            catcher(err, next)
        }

    }
    async listNotAddedPlaceTrips(req: Request, res: Response, next: NextFunction) {
        try {
            validateIdParams(req.params.placeId)
            const trips = await this.tripService.listNotAddedPlaceTrips(req.user.id, req.params.placeId)
            res.json(trips)
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async createCustomizedTrip(req: Request, res: Response, next: NextFunction) {
        try {
            const { value, error } = createCustomizedTripSchema.validate(req.body)
            if (error) throw new OperationalError(error.message)
            const message = await this.tripService.createCustomizedTrip(value, req.user.id)
            res.json({ message });
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async updateCustomizedTrip(req: Request, res: Response, next: NextFunction) {
        try {
            validateIdParams(req.params.tripId);
            const { value, error } = createCustomizedTripSchema.validate(req.body)
            if (error) throw new OperationalError(error.message)
            const message = await this.tripService.updateCustomizedTrip(req.user.id, req.params.tripId, value)
            res.json({ message })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async getTrip(req: Request, res: Response, next: NextFunction) {
        try {
            validateIdParams(req.params.tripId);
            const trip = await this.tripService.getTrip(req.user.id, req.params.tripId)
            res.json(trip)
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async deleteTrip(req: Request, res: Response, next: NextFunction) {
        try {
            validateIdParams(req.params.tripId);
            const message = await this.tripService.deleteTrip(req.user.id, req.params.tripId)
            res.json({ message })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async addPlaceToTrip(req: Request, res: Response, next: NextFunction) {
        try {
            validateIdParams(req.params.tripId);
            const { error, value } = placeTripSchema.validate(req.body)
            const message = await this.tripService.addPlaceToTrip(req.user.id, req.params.tripId, value.placeId)
            res.json({ message })
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async deletePlaceFromTrip(req: Request, res: Response, next: NextFunction) {
        try {
            validateIdParams(req.params.tripId);
            validateIdParams(req.params.placeId);
            const message = await this.tripService.deletePlaceFromTrip(req.user.id, req.params.tripId, req.params.placeId)
            res.json({ message })
        }
        catch (err) {
            catcher(err, next)
        }
    }
}
