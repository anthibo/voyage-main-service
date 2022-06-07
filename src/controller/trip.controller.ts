import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import { OperationalError } from "../utils/helpers/error";
import { catcher } from "../utils/helpers/catcher";

export class TripController {

    private userService: UserService
    constructor() {
        this.userService = new UserService();
        this.listAllUserTrips = this.listAllUserTrips.bind(this)
        this.createCustomizedTrip = this.createCustomizedTrip.bind(this)
    }

    async listAllUserTrips(req: Request, res: Response, next: NextFunction) {

    }
    async createCustomizedTrip(req: Request, res: Response, next: NextFunction) {
    }
}
