import Joi from 'joi';

export const flightSearchFormSchema = Joi.object({
  fromAirport: Joi.string().min(3).max(3).required().messages({
    'string.empty': 'Departure airport is required',
    'string.min': 'Airport code must be 3 characters',
    'string.max': 'Airport code must be 3 characters',
    'any.required': 'Departure airport is required',
  }),
  toAirport: Joi.string().min(3).max(3).required().messages({
    'string.empty': 'Destination airport is required',
    'string.min': 'Airport code must be 3 characters',
    'string.max': 'Airport code must be 3 characters',
    'any.required': 'Destination airport is required',
  }),
  departureDate: Joi.date().min('now').required().messages({
    'date.base': 'Please select a valid departure date',
    'date.min': 'Departure date cannot be in the past',
    'any.required': 'Departure date is required',
  }),
  returnDate: Joi.date()
    .when('tripType', {
      is: 'roundTrip',
      then: Joi.required().messages({
        'any.required': 'Return date is required for round trip',
      }),
      otherwise: Joi.optional().allow(''),
    })
    .when('departureDate', {
      is: Joi.exist().not(null).not(''),
      then: Joi.date().greater(Joi.ref('departureDate')).messages({
        'date.greater': 'Return date must be after departure date',
      }),
    })
    .messages({
      'date.base': 'Please select a valid return date',
    }),
  tripType: Joi.string().valid('roundTrip', 'oneWay').required().messages({
    'any.only': 'Trip type must be either roundTrip or oneWay',
    'any.required': 'Trip type is required',
  }),
  adults: Joi.number().min(1).max(9).required().messages({
    'number.min': 'At least 1 adult is required',
    'number.max': 'Maximum 9 adults allowed',
    'any.required': 'Number of adults is required',
  }),
  children: Joi.number().min(0).max(8).optional().messages({
    'number.min': 'Children count cannot be negative',
    'number.max': 'Maximum 8 children allowed',
  }),
  infants: Joi.number()
    .min(0)
    .max(8)
    .optional()
    .when('adults', {
      is: Joi.number().min(1),
      then: Joi.number().max(Joi.ref('adults')).messages({
        'number.max': 'Number of infants cannot exceed number of adults',
      }),
    })
    .messages({
      'number.min': 'Infants count cannot be negative',
      'number.max': 'Maximum 8 infants allowed',
    }),
  cabinClass: Joi.string().valid('ECONOMY', 'BUSINESS').required().messages({
    'any.only': 'Cabin class must be either ECONOMY or BUSINESS',
    'any.required': 'Cabin class is required',
  }),
}).custom((value, helpers) => {
  // Custom validation: Check if return date is provided without departure date
  if (
    value.returnDate &&
    (!value.departureDate || value.departureDate === '')
  ) {
    return helpers.error('returnDate.custom', {
      message: 'Please select a departure date first',
    });
  }

  // Custom validation: total passengers should not exceed 9
  const totalPassengers =
    (value.adults || 0) + (value.children || 0) + (value.infants || 0);
  if (totalPassengers > 9) {
    return helpers.error('any.custom', {
      message: 'Total passengers cannot exceed 9',
    });
  }
  return value;
});
