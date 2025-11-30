import { joiResolver } from '@hookform/resolvers/joi';
import { searchFormSchema } from '../validations/searchFormSchema';

export const searchFormResolver = joiResolver(searchFormSchema, {
  // Ensure all errors are collected, not just the first one
  abortEarly: false,
  // Allow unknown keys in the validation object
  allowUnknown: true,
  // Convert string values to their proper types when possible
  convert: true,
});
