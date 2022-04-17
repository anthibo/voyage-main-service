import Joi from "joi"
import AppError from "../../errors/error"

const IdParamsSchema = Joi.string().uuid()
export const validateIdParams = (id: string) => {
    const { value, error } = IdParamsSchema.validate(id)
    if (error) {
        throw new AppError('id params is invalid')
    }
}

