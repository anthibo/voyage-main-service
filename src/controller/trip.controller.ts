import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import { OperationalError } from "../utils/helpers/error";
import { catcher } from "../utils/helpers/catcher";
import TripService from "../services/trip.service";
import { createCustomizedTripSchema } from "../utils/schemas/trip.schema";

export class TripController {

    private userService: UserService
    private tripService: TripService
    constructor() {
        this.userService = new UserService();
        this.listAllUserTrips = this.listAllUserTrips.bind(this)
        this.createCustomizedTrip = this.createCustomizedTrip.bind(this)
    }

    async listAllUserTrips(req: Request, res: Response, next: NextFunction) {
        
    }
    async createCustomizedTrip(req: Request, res: Response, next: NextFunction) {
        try{
            const {value, error} = createCustomizedTripSchema.validate(req.body)
            if(error) throw new OperationalError(error.message)
            const trip = await this.tripService.createCustomizedTrip(value, req.user.id)
            return trip;
        }
        catch(err){
            catcher(err, next)
        }
    }
}
