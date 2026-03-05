const Joi = require('joi');

const addExpenseValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    amount: Joi.number().min(0).required(),
    category: Joi.string().max(100)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.details
    });
  }
  next();
};

const updateExpenseValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200),
    amount: Joi.number().min(0),
    category: Joi.string().max(100)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.details
    });
  }
  next();
};

module.exports = {
  addExpenseValidation,
  updateExpenseValidation
};
