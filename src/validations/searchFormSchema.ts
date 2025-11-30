import Joi from 'joi';

const locationSchema = Joi.object({
  latitude: Joi.number().required().messages({
    'number.base': 'Please select a valid location',
    'any.required': 'Location is required',
  }),
  longitude: Joi.number().required().messages({
    'number.base': 'Please select a valid location',
    'any.required': 'Location is required',
  }),
});

const roomSchema = Joi.object({
  AdultsCount: Joi.number().min(1).max(10).required().messages({
    'number.min': 'At least 1 adult is required',
    'number.max': 'Maximum 10 adults allowed per room',
    'any.required': 'Number of adults is required',
  }),
  KidsAges: Joi.array().items(
    Joi.number().min(0).max(17).messages({
      'number.min': 'Child age must be between 0 and 17',
      'number.max': 'Child age must be between 0 and 17',
    }),
  ),
});

export const searchFormSchema = Joi.object({
  country: Joi.string().required().messages({
    'string.empty': 'Country is required',
    'any.required': 'Country is required',
  }),
  radiusInMeters: Joi.number().required(),
  location: locationSchema.required().messages({
    'number.base': 'Please select a valid location',
    'any.required': 'Location is required',
  }),
  checkIn: Joi.date().required().messages({
    'date.base': 'Please select a valid check-in date',
    'any.required': 'Check-in date is required',
  }),
  checkOut: Joi.date().greater(Joi.ref('checkIn')).required().messages({
    'date.base': 'Please select a valid check-out date',
    'date.greater': 'Check-out date must be after check-in date',
    'any.required': 'Check-out date is required',
  }),
  rooms: Joi.array().items(roomSchema).min(1).required().messages({
    'array.min': 'At least one room is required',
    'any.required': 'Room information is required',
  }),
});
