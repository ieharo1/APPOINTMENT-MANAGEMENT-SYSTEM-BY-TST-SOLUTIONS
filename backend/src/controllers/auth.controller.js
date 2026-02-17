import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { signToken } from '../services/token.service.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  businessName: user.businessName,
  phone: user.phone,
  logoUrl: user.logoUrl,
  workingHours: user.workingHours,
  serviceDurationDefault: user.serviceDurationDefault,
  services: user.services
});

export const register = catchAsync(async (req, res) => {
  const { name, email, password, businessName, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('El email ya está registrado', 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    businessName,
    phone,
    services: [{ name: 'Servicio base', duration: 60, price: 20 }]
  });

  const token = signToken(user._id);
  res.status(201).json({ success: true, token, user: sanitizeUser(user) });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Credenciales inválidas', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Credenciales inválidas', 401);

  const token = signToken(user._id);
  res.json({ success: true, token, user: sanitizeUser(user) });
});

export const me = catchAsync(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});
