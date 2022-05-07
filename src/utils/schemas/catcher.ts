import { NextFunction, Request, Response } from "express"
import { NonOperationalError, OperationalError } from "../helpers/error"

export const catcher =  (err: any, next: NextFunction) => {
    if (err instanceof Error) {
      next(new NonOperationalError(err.message, err.stack))
    }
    else {
       next(err)
    }
}