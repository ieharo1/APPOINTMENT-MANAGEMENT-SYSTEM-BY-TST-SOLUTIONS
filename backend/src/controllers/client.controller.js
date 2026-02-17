import { Client } from '../models/client.model.js';
import { Appointment } from '../models/appointment.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

export const createClient = catchAsync(async (req, res) => {
  const client = await Client.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, client });
});

export const getClients = catchAsync(async (req, res) => {
  const { q } = req.query;
  const filter = { owner: req.user._id };

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } }
    ];
  }

  const clients = await Client.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, clients });
});

export const updateClient = catchAsync(async (req, res) => {
  const client = await Client.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
  if (!client) throw new AppError('Cliente no encontrado', 404);
  res.json({ success: true, client });
});

export const deleteClient = catchAsync(async (req, res) => {
  const client = await Client.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!client) throw new AppError('Cliente no encontrado', 404);
  await Appointment.deleteMany({ client: client._id, owner: req.user._id });
  res.json({ success: true, message: 'Cliente eliminado' });
});

export const clientHistory = catchAsync(async (req, res) => {
  const appointments = await Appointment.find({ owner: req.user._id, client: req.params.id })
    .populate('client', 'name phone')
    .sort({ date: -1, time: -1 });

  res.json({ success: true, appointments });
});
