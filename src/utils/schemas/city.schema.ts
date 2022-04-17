import Joi from "joi";

export const createCitySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rating: Joi.number().min(0).max(5), 
    location: Joi.array().items(Joi.number().required()).length(2).required(),
    photos: Joi.array().items(Joi.string().uri()),
    weatherAPI: Joi.string().uri().required()

})