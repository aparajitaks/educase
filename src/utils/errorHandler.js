/**
 * Global error-handling middleware for Express.
 * Returns consistent JSON error responses.
 */
function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
