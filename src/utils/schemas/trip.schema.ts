import Joi from "joi";

export const createCustomizedTripSchema = Joi.object({
    cityId: Joi.string().uuid().required(),
    name: Joi.string().required(),
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

export const saveGeneratedTrip = Joi.object({
    city: Joi.object({
        id: Joi.string().uuid().required(),
        name: Joi.string()
    }),
    name: Joi.string().required(),
    agenda: Joi.array().items(
        Joi.any()
    )
})
