'use strict'

import Joi from 'joi';

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    access_token: [
        Joi.string(),
        Joi.number()
    ],
    // Joi.string().valid('male', 'female', 'other').required(),
    // birthday: Joi.string().isoDate().required()
    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    email: Joi.string()
        .email()
        .required()
})

export default schema
