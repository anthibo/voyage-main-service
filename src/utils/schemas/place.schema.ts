import Joi from "joi";

export const placeInputSchema = Joi.object({
    name: Joi.string().required(),
    cityId: Joi.string().required(),
    description: Joi.string().required(),
    rating: Joi.number().min(0).max(5), 
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    photos: Joi.array().items(Joi.string().uri()),
    phoneNumber: Joi.string(),
    website: Joi.string().uri(),
    activityType: Joi.string().required(),
    price: Joi.number().required()
})