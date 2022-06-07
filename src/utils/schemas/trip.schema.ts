import Joi from "joi";

export const createCustomizedTripSchema = Joi.object({
    cityId: Joi.string().uuid().required(),
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
}
)