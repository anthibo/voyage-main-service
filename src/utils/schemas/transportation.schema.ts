import Joi from "joi";

export const transportationCityFeesSchema = Joi.object({
    cityId: Joi.string().required(),
    transportationMeanId:Joi.string().required(),
    kmCost:Joi.number().required(),
})