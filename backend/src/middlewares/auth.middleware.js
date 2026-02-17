import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No autorizado', 401));
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('Usuario no encontrado', 401));
  }

  req.user = user;
  next();
};
