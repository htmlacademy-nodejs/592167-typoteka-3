'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  articleId: Joi.number().required(),
  userId: Joi.number().required(),
  comment: Joi.string().min(20).required(),
});
