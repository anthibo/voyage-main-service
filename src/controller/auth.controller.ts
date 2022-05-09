import { NextFunction, Request, Response } from "express";
import Joi from 'joi';
import { OperationalError, NonOperationalError } from "../utils/helpers/error";
import AuthService from '../services/auth.service'
import { adminRegisterSchema, agencyRegisterSchema, userLoginSchema, userRegisterSchema } from "../utils/schemas/auth.schema";
import { catcher } from "../utils/helpers/catcher";

export class AuthController {
    private authService: AuthService
    constructor() {

        this.authService = new AuthService()
        this.registerAgency = this.registerAgency.bind(this)
        this.registerNormalUser = this.registerNormalUser.bind(this)
        this.registerAdmin = this.registerAdmin.bind(this)
        this.loginNormalUser = this.loginNormalUser.bind(this)
        this.loginAgency = this.loginAgency.bind(this)
        this.loginAdmin = this.loginAdmin.bind(this)

    }

    async registerNormalUser(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = userRegisterSchema.validate(request.body)
            if (error) {
                return response.status(400).json({
                    message: error.message
                })
            }
            const res = await this.authService.createNormalUser(value)
            return response.status(201).json(res)
        }
        catch (err) {
            catcher(err, next)
        }

    }
    async registerAdmin(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = adminRegisterSchema.validate(request.body)
            if (error) {
                return response.status(400).json({
                    message: error.message
                })
            }
            const res = await this.authService.createAdminUser(value)
            return response.status(201).json(res)
        }
        catch (err) {
            catcher(err, next)
        }

    }
    async registerAgency(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = agencyRegisterSchema.validate(request.body)
            if (error) {
                return response.status(400).json({
                    message: error.message
                })
            }
            const res = await this.authService.createAgency(value)
            return response.status(201).json(res)
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async loginNormalUser(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = userLoginSchema.validate(request.body)
            if (error) {
                return response.status(400).json({
                    message: error.message
                })
            }
            const res = await this.authService.loginNormalUser(value)
            return response.status(200).json(res)
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async loginAdmin(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = userLoginSchema.validate(request.body)
            if (error) {
                throw new OperationalError(error.message, 400)
            }
            const res = await this.authService.loginAdmin(value)
            return response.status(200).json(res)
        }
        catch (err) {
            catcher(err, next)
        }
    }

    async loginAgency(request: Request, response: Response, next: NextFunction) {
        try {
            const { value, error } = userLoginSchema.validate(request.body)
            if (error) {
                return response.status(400).json({
                    message: error.message
                })
            }
            const res = await this.authService.loginAgency(value)
            return response.status(200).json(res)
        }
        catch (err) {
            catcher(err, next)
        }
    }
    async forgetUserPassword(request: Request, response: Response) {

    }
    async forgetAgencyPassword(request: Request, response: Response) {

    }
}