import Joi from "joi"
import {OperationalError} from "./error"

const IdParamsSchema = Joi.string().uuid()
export const validateIdParams = (id: string) => {
    const { value, error } = IdParamsSchema.validate(id)
    if (error) {
        throw new OperationalError('id params is invalid')
    }
}

