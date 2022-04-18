
declare namespace Express {
    export interface Request {
        user?: {
            id: string,
            username: string,
            securityRole: string,
            iat: number,
            exp: number
        }
    }
}