const Joi = require("joi");

module.exports = {
  Schema: {
    addAdmin: Joi.object({
      name: Joi.string().required().max(15),
      mail: Joi.string().required().max(30).email(),
      password: Joi.string().required().min(8).max(20)
    }),
    idParam: Joi.object({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    idPhParam: Joi.object({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      phone: Joi.number().required().max(11).min(11)
    }),
    loginAdmin: Joi.object({
      name: Joi.string().min(7).max(30).required().email(),
      password: Joi.string().min(8).required()
    })
  }
};
