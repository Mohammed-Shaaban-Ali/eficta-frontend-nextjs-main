import Joi from 'joi';

// Define Joi validation schema
export const validationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email address',
    }),
  password: Joi.string().min(4).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 4 characters',
  }),
});
