import Joi from "joi";

export const createCustomizedTripSchema = Joi.object({
    cityId: Joi.string().uuid().required(),
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
}
)
export const placeTripSchema = Joi.object({
    placeId: Joi.string().uuid().required(),
})
export const createGeneratedTrip = Joi.object({
    cityId: Joi.string().uuid().required(),
    name: Joi.string().required(),
    numberOfDays: Joi.number().integer().required(),
    activities: Joi.array().items(Joi.string()).required()
})
