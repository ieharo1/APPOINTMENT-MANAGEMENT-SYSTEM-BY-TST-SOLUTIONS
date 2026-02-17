import { env } from '../config/env.js';

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (env.nodeEnv !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' ? { stack: err.stack } : {})
  });
};
