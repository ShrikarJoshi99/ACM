import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorList = errors.array();
    const firstError = errorList[0];
    const message = firstError.msg !== 'Invalid value'
      ? firstError.msg
      : `Invalid ${firstError.path || 'input'}`;
    return res.status(400).json({
      success: false,
      message,
      errors: errorList
    });
  }

  next();
};

export default validate;