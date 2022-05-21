import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

const TEMP_DIR = `${__dirname}/../../temp`
if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR);
}

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, TEMP_DIR)
    },
    filename: (req: any, file: any, cb: any) => {
            cb(null, `${new Date().toISOString()}.jpeg`)
        }
})
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    else {
        cb({ message: 'Unsupported file format, false' })
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 }
})