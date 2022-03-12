import {sign} from 'jsonwebtoken'

export const SignToken =  (payload): string => {
    return  sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.EXPIRES_IN
      }) 
    }