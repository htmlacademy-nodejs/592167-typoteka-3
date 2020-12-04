'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string().min(30).max(250).required(),
  announce: Joi.string().min(30).max(250).required(),
  description: Joi.string().max(1000),
  userId: Joi.number().required(),
  categories: Joi.array().items(Joi.number()).min(1).required(),
});
