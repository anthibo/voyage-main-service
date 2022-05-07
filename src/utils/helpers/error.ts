import { Response } from "express";


class OperationalError implements IBaseError  {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(message: string, statusCode = 400) {
    this.statusCode = statusCode;
    this.message = message
  }

  sendErrorResponse(response: Response){
    return response.status(this.statusCode).json({
      status: 'failed',
      message: this.message
    })
  }
}
class NonOperationalError implements IBaseError {
  public readonly statusCode = 500;
  public readonly message: string;
  public readonly stack: string;
  constructor(message: string, stack: string) {
    this.message = message
    this.stack = stack
  }
  
  sendErrorResponse(response: Response) {
    const message = process.env.NODE_ENV === 'production'? 'something went wrong' : this.message
    console.log(this.stack);
    return response.status(this.statusCode).json({
      status: 'failed',
      message
    })
  }
  
}

interface IBaseError {
  readonly statusCode: number;
  readonly message: string
  readonly stack?: string;
  sendErrorResponse( response: Response): any;
}

export { IBaseError, NonOperationalError, OperationalError };