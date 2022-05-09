import {NextFunction, Request, Response} from "express"
import {IBaseError, OperationalError} from "../helpers/error"


export const handleGlobalErrors = (error: IBaseError, request: Request, response: Response, next: NextFunction) => {
   console.log(error.message, error.statusCode)
   error.sendErrorResponse(response)
}