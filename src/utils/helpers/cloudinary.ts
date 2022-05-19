import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const uploadToCloud =  (file: string): Promise<{url:string, id:string}> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, {
            folder: 'voyage',
        }, (err, result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        } ).catch(err => reject(err))
    })
}