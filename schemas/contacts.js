const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({ "any.required": "missing required name" }),
  email: Joi.string()
    .min(4)
    .max(70)
    .required()
    .messages({ "any.required": "missing required email" }),
  phone: Joi.string()
    .min(4)
    .max(20)
    .required()
    .messages({ "any.required": "missing required phone" }),
});

module.exports = {
  addSchema,
};
