import Joi from 'joi';

const registerValidationMiddleware = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().not().empty().required(),
    lastName: Joi.string().not().empty().required(),
    userName: Joi.string().not().empty().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(64)
      .custom((value, helpers) => {
        // Kiểm tra mật khẩu không trùng với các mật khẩu đã biết 
        const blacklist = ["password", "123456", "abc123"];
        if (blacklist.includes(value.toLowerCase())) {
          return helpers.error("any.invalid");
        } return value;
      }).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const loginValidationMiddleware = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(64).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export {
  registerValidationMiddleware,
  loginValidationMiddleware,
};
