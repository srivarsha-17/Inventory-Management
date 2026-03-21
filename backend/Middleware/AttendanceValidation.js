const Joi = require('joi');

const addAttendanceValidation = (req, res, next) => {
  const schema = Joi.object({
    date: Joi.date().required(),
    labourRecords: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().optional(), // Allow id from frontend
          labourType: Joi.string().min(1).max(100).required(),
          workers: Joi.number().min(0).required(),
          wage: Joi.number().min(0).required(),
          total: Joi.number().min(0).required()
        })
      )
      .min(1)
      .required(),
    grandTotal: Joi.number().min(0).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.log("Validation Error:", error.details);
    return res.status(400).json({
      message: "Bad request - Validation failed",
      error: error.details.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }
  next();
};

const updateAttendanceValidation = (req, res, next) => {
  const schema = Joi.object({
    date: Joi.date(),
    labourRecords: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().optional(),
          labourType: Joi.string().min(1).max(100),
          workers: Joi.number().min(0),
          wage: Joi.number().min(0),
          total: Joi.number().min(0)
        })
      )
      .min(1), // At least one labour record required
    grandTotal: Joi.number().min(0),
    status: Joi.string().valid('draft', 'submitted')
  }).min(1); // At least one field must be provided

  const { error } = schema.validate(req.body);
  if (error) {
    console.log("Update Validation Error:", error.details);
    return res.status(400).json({
      message: "Bad request - Validation failed",
      error: error.details.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }
  next();
};

module.exports = {
  addAttendanceValidation,
  updateAttendanceValidation
};
