import Joi from "joi"

export const userRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string(),
    currentCity: Joi.string().uuid()
})
export const adminRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    currentCity: Joi.string().uuid()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string() 
}).or('email', 'username')

export const agencyRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    companyName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string(),
    fb_link: Joi.string().uri(),
    ig_link: Joi.string().uri(),
    nationalId: Joi.string().required()

})

export const changeUserPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required(),
    confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword')),
})