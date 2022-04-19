import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'

export const auth = (request: Request, response: Response, next: NextFunction) => {
  try {
    let token = request.headers.authorization;
    if (!token) return response.status(403).json({
      status: 'failed',
      message: 'Not authorized to use this api'
    });
    console.log(token)
    if (token.toLowerCase().startsWith('bearer')) {
      token = token.slice('Bearer'.length).trim();
    }
    const decoded = verify(token, process.env.JWT_SECRET_KEY) as {
      id: string,
      username: string,
      securityRole: string,
      iat: number,
      exp: number
    };
    request.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    if (error.name === 'TokenExpiredError') {
      response.status(401).json({ message: 'Expired token' });
      return;
    }
    response.status(500).json({ message: 'Failed to authenticate user' });
  }
};

export const checkPermission = (request: Request, response: Response, next: NextFunction) => {


}