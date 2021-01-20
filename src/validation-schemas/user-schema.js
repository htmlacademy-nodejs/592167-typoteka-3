'use strict';

const Joi = require(`joi`);
const {REGISTRATION_MESSAGE} = require(`../constants`);

module.exports = Joi.object({
  firstName: Joi.string()
    .required()
    .max(50)
    .pattern(new RegExp(`^[a-zа-я\s]*$`, `i`))
    .messages({
      'string.max': REGISTRATION_MESSAGE.USER_NAME_MAX_LENGTH,
      'any.required': REGISTRATION_MESSAGE.USER_NAME_REQUIRED_FIELD,
      'string.pattern.base': REGISTRATION_MESSAGE.USER_NAME_PATTERN,
    }),

  lastName: Joi.string()
    .required()
    .max(50)
    .pattern(new RegExp(`^[a-zа-я\s]*$`, `i`))
    .messages({
      'string.max': REGISTRATION_MESSAGE.USER_SURNAME_MAX_LENGTH,
      'any.required': REGISTRATION_MESSAGE.USER_SURNAME_REQUIRED_FIELD,
      'string.pattern.base': REGISTRATION_MESSAGE.USER_SURNAME_PATTERN,
    }),

  email: Joi.string()
    .required()
    .max(100)
    .email()
    .messages({
      'string.max': REGISTRATION_MESSAGE.EMAIL_MAX_LENGTH,
      'any.required': REGISTRATION_MESSAGE.EMAIL_REQUIRED_FIELD,
      'string.email': REGISTRATION_MESSAGE.EMAIL_WRONG,
    }),

  password: Joi.string()
    .required()
    .min(6)
    .max(255)
    .messages({
      'string.min': REGISTRATION_MESSAGE.PASSWORD_MIN_LENGTH,
      'string.max': REGISTRATION_MESSAGE.PASSWORD_MAX_LENGTH,
      'any.required': REGISTRATION_MESSAGE.PASSWORD_REQUIRED_FIELD,
    }),

  repeat: Joi.string()
    .required()
    .min(6)
    .max(255)
    .valid(Joi.ref(`password`))
    .messages({
      'string.min': REGISTRATION_MESSAGE.REPEAT_MIN_LENGTH,
      'string.max': REGISTRATION_MESSAGE.REPEAT_MAX_LENGTH,
      'any.required': REGISTRATION_MESSAGE.REPEAT_REQUIRED_FIELD,
      'any.only': REGISTRATION_MESSAGE.PASSWORDS_NOT_EQUALS,
    }),
});
