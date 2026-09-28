import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword:Joi.string().valid(Joi.ref('password')).required(),
  role: Joi.string().valid('user', 'admin').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  currentPassword: Joi.string().min(6),
  password: Joi.string().min(6),
  confirmPassword: Joi.string().valid(Joi.ref("password"))
}).or("name", "email", "password", "currentPassword");

export {registerSchema,loginSchema,updateProfileSchema};