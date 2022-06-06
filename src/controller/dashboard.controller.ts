import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import { OperationalError } from "../utils/helpers/error";
import { catcher } from "../utils/helpers/catcher";
import DashboardService from "../services/dashboard.service";

export class DashboardController {

    private dashboardService: DashboardService
    constructor() {
        this.dashboardService = new DashboardService();
        this.getPlaceCityUsersStats = this.getPlaceCityUsersStats.bind(this)
    }

    async getPlaceCityUsersStats(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.user
            const stats = await this.dashboardService.getPlaceCityUsersStats();
            response.status(200).json({
                ...stats
            })
        } catch (err) {
            catcher(err, next)
        }
    }


}