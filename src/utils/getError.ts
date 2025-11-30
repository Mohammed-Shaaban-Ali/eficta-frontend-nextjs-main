export const getError = (error: any): string => {
  if (error.response) {
    // Request made but server responded with e
    return (
      error.response.data.error ||
      error.response.data.message ||
      error.response.error ||
      error.message
    );
  } else if (error.request) {
    // Request made but no onse received
    return 'No response received from server';
  } else {
    // Error setting up the request
    return error.message || 'An unexpected error occurred';
  }
};
