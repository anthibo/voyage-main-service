import {NextFunction, Request, Response} from "express";
import Joi from 'joi';
import AppError from "../errors/error";
import AuthService from '../services/auth.service'
import { agencyRegisterSchema, userLoginSchema, userRegisterSchema } from "../utils/schemas/auth.schema";

export class AuthController {
    private authService: AuthService
    constructor() {

        this.authService = new AuthService()
        this.registerAgency = this.registerAgency.bind(this)
        this.registerNormalUser = this.registerNormalUser.bind(this)
        this.loginNormalUser = this.loginNormalUser.bind(this)
        this.loginAgency = this.loginAgency.bind(this)

    }
    
    async registerNormalUser(request: Request, response: Response, next: NextFunction) {
        try{
            const {value, error} = userRegisterSchema.validate(request.body)
            if(error){
               return response.status(400).json({
                    message: error.message
                })
            }
           const res = await this.authService.createNormalUser(value)
           return response.status(201).json(res)
        }
        catch(err){
            console.log(err)
           return response.status(500).json(err)
        }
        
    }
    async registerAgency(request: Request, response: Response, next: NextFunction) {
        try{
            const {value, error} = agencyRegisterSchema.validate(request.body)
            if(error){
               return response.status(400).json({
                    message: error.message
                })
            }
           const res = await this.authService.createAgency(value)
           return response.status(201).json(res)
        }
        catch(err){
            console.log(err)
           return response.status(500).json(err)
        }
    }

    async loginNormalUser(request: Request, response: Response, next: NextFunction){
        try{
            const {value, error} = userLoginSchema.validate(request.body)
            if(error){
               return response.status(400).json({
                    message: error.message
                })
            }
           const res = await this.authService.loginNormalUser(value)
           return response.status(200).json(res)
        }
        catch(err){
            console.log(err)
            if(err instanceof AppError){
                response.status(err.statusCode).json({
                    message: err.message
                })
            }
            else{ 
                response.status(500).json({
                    err
                })
            }
        }
    }

    async loginAgency(request: Request, response: Response){
        try{
            const {value, error} = userLoginSchema.validate(request.body)
            if(error){
               return response.status(400).json({
                    message: error.message
                })
            }
           const res = await this.authService.loginAgency(value)
           return response.status(200).json(res)
        }
        catch(err){
            console.log(err)
            if(err instanceof AppError){
                response.status(err.statusCode).json({
                    message: err.message
                })
            }
            else{ 
                response.status(500).json({
                    err
                })
            }
        }
    }
    async forgetUserPassword(request: Request, response: Response){
        
    }
    async forgetAgencyPassword(request: Request, response: Response){

    }
}