const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
  });
};

export default errorHandler;
