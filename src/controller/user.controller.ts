import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import { OperationalError } from "../utils/helpers/error";
import { catcher } from "../utils/schemas/catcher";

export class UserController {

    private userService: UserService
    constructor() {
        this.userService = new UserService();
        this.getNormalUserDataByToken = this.getNormalUserDataByToken.bind(this)
    }

    async getNormalUserDataByToken(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.user
            const userData = await this.userService.findNormalUserById(id);
            response.status(200).json({
                data: userData
            })


        } catch (err) {
            catcher(err, next)
        }
    }

}