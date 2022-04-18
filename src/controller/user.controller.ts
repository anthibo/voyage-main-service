import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import UserService from "../services/users.service";
import AppError from "../errors/error";

export class UserController {

    private userService: UserService
    constructor() {
        this.userService = new UserService();
        this.getNormalUserDataByToken = this.getNormalUserDataByToken.bind(this)
    }

    async getNormalUserDataByToken(request: Request, response: Response, next: NextFunction) {
        try {
            const {id} = request.user
            const userData = await this.userService.findNormalUserById(id);
            response.status(200).json({
                data: userData
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

}