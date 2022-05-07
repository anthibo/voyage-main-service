// import { getConnection, getRepository, Repository } from 'typeorm';
// import { sign } from 'jsonwebtoken'
// import { User } from '../entity/user.entity';
// import { SignToken } from '../utils/helpers/auth';
// import { Agency } from '../entity/agency.entity';
// import AppError from '../errors/error'
// import { S3 } from 'aws-sdk'
// export default class AuthService {
//     private client: S3;
//     constructor() {
//         this.client = new S3(
//             {
//                 accessKeyId: process.env.S3_KEY,
//                 secretAccessKey: process.env.S3_SECRET,
//                 region: process.env.S3_REGION
//             })
//     }
//     async uploadImage(blob: any) {
//         const uploadedImage = await this.client.upload({
//             Bucket: process.env.S3_BUCKET
//         }).promise()
//     }


// }
