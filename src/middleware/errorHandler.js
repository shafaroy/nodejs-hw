import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  const statusCode =
    err instanceof createHttpError.HttpError ? err.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
  });
};
