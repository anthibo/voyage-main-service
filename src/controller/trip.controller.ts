import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import { OperationalError } from "../utils/helpers/error";
import { catcher } from "../utils/helpers/catcher";
import TripService from "../services/trip.service";
import { createCustomizedTripSchema } from "../utils/schemas/trip.schema";
import { validateIdParams } from "../utils/helpers/parameters.validator";

export class TripController {

    private userService: UserService
    private tripService: TripService
    constructor() {
        this.userService = new UserService();
        this.listAllUserTrips = this.listAllUserTrips.bind(this)
        this.tripService = new TripService()
        this.createCustomizedTrip = this.createCustomizedTrip.bind(this)
        this.getTrip = this.getTrip.bind(this)
    }

    async listAllUserTrips(req: Request, res: Response, next: NextFunction) {
        try{
            const trips = await this.tripService.findAllUserTrips(req.user.id)
            res.json(trips)
        }
        catch(err){
            catcher(err, next)
        }
        
    }
    async createCustomizedTrip(req: Request, res: Response, next: NextFunction) {
        try{
            const {value, error} = createCustomizedTripSchema.validate(req.body)
            if(error) throw new OperationalError(error.message)
            const message = await this.tripService.createCustomizedTrip(value, req.user.id)
            res.json({message}) ;
        }
        catch(err){
            catcher(err, next)
        }
    }
    async getTrip(req: Request, res: Response, next: NextFunction) {
        try{
            validateIdParams(req.params.tripId);
            const trip = await this.tripService.getTrip(req.user.id, req.params.tripId)
            res.json(trip)
        }
        catch(err){
            catcher(err, next)
        }
    }
}
