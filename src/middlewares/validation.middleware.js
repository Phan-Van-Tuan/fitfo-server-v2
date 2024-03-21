import Joi from 'joi';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
const blacklist = ["password", "admin", "root", "123456", "qwerty", "<scrip>", "/<script.?>/", "/<.?javascript:.?>/", "/<.?alert.∗?.∗?.?>/", "/SELECT .? FROM/"];

const registerShema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().not().empty().required(),
    lastName: Joi.string().not().empty().required(),
    userName: Joi.string().not().empty().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(64)
      .custom((value, helpers) => {
        if (blacklist.includes(value.toLowerCase())) {
          return helpers.error("any.invalid");
        }

        if (!passwordRegex.test(value)) {
          return helpers.error('any.invalid');
        }

        return value;
      }).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json(error);
  }
  next();
};

const loginSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(64)
      .custom((value, helpers) => {
        // Kiểm tra mật khẩu không trùng với các mật khẩu đã biết 
        const blacklist = ["password", "123456", "abc123", "<scrip>"];

        if (blacklist.includes(value.toLowerCase())) {
          return helpers.error("any.invalid");
        }

        if (!passwordRegex.test(value)) {
          return helpers.error('any.invalid');
        }

        return value;
      }).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const forgotPWSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const changePWSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(64)
      .custom((value, helpers) => {
        // Kiểm tra mật khẩu không trùng với các mật khẩu đã biết 
        const blacklist = ["password", "123456", "abc123", "<scrip>"];

        if (blacklist.includes(value.toLowerCase())) {
          return helpers.error("any.invalid");
        }

        if (!passwordRegex.test(value)) {
          return helpers.error('any.invalid');
        }

        return value;
      }).required(),
    newPassword: Joi.string().min(8).max(64)
      .custom((value, helpers) => {
        // Kiểm tra mật khẩu không trùng với các mật khẩu đã biết 

        if (blacklist.includes(value.toLowerCase())) {
          return helpers.error("any.invalid");
        }

        if (!passwordRegex.test(value)) {
          return helpers.error('any.invalid');
        }

        return value;
      }).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const verifyOTPSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const resetPWSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    // Nếu có lỗi, trả về 400 Bad Request với thông báo lỗi
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};




export {
  registerShema,
  loginSchema,
  verifyOTPSchema,
  changePWSchema,
  forgotPWSchema,
  resetPWSchema
};
