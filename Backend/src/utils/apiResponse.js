
/**
 * Send success response
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 */
export const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    error: message,
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

export default {
  sendSuccess,
  sendError,
};
