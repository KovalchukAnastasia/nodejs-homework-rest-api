const { Schema, model } = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../helpers/handleMongooseError");

const phoneRegexp = /^\(\d{3}\)-\d{3}-\d{4}$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: phoneRegexp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handleMongooseError);

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
    .messages({ "any.required": "missing required phone" })
    .pattern(phoneRegexp),
  favorite: Joi.boolean().optional(),
});
const updateSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  email: Joi.string().min(4).max(70).optional(),
  phone: Joi.string().min(4).max(20).optional(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).messages({
  "any.required": "missing field favorite",
});

const schemas = { addSchema, updateSchema, updateFavoriteSchema };
const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
