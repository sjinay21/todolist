import { registerSchema, loginSchema, updateProfileSchema } from '../schema/userschema.js';

function validateRegister(req, res, next) {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

function validateLogin(req, res, next) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
function validateUpdate(req, res, next) {
  const { error } = updateProfileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
}


export { validateRegister, validateLogin, validateUpdate };
