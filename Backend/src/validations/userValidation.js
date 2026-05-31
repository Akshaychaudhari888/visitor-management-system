import Joi from 'joi';

export const createUserValidation = Joi.object({
    userName: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(12).required(),
    role: Joi.string().valid('Admin','HR','Security','Manager').required()
})

export const loginUser = Joi.object({
    phone: Joi.string().min(10).max(12).required(),
    password: Joi.string().required()
})