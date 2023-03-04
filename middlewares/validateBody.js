// const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    console.log(req);
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    next();
  };

  return func;
};

module.exports = validateBody;
