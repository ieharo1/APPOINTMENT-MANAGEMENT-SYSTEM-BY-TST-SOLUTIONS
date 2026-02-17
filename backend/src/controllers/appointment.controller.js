import { Appointment } from '../models/appointment.model.js';
import { Client } from '../models/client.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

const validateDateInFuture = (date, time) => {
  const selected = new Date(`${date}T${time}:00`);
  return selected.getTime() >= new Date().getTime();
};

const hasConflict = async ({ owner, date, time, duration, excludeId }) => {
  const [h, m] = time.split(':').map(Number);
  const start = h * 60 + m;
  const end = start + Number(duration);

  const sameDay = await Appointment.find({
    owner,
    date,
    status: { $ne: 'cancelada' },
    ...(excludeId ? { _id: { $ne: excludeId } } : {})
  });

  return sameDay.some((a) => {
    const [ah, am] = a.time.split(':').map(Number);
    const aStart = ah * 60 + am;
    const aEnd = aStart + a.duration;
    return start < aEnd && end > aStart;
  });
};

export const createAppointment = catchAsync(async (req, res) => {
  const payload = { ...req.body, owner: req.user._id };
  const client = await Client.findOne({ _id: payload.client, owner: req.user._id });
  if (!client) throw new AppError('Cliente inválido', 404);
  if (!validateDateInFuture(payload.date, payload.time)) throw new AppError('No se pueden crear citas en el pasado', 422);
  if (await hasConflict(payload)) throw new AppError('Horario no disponible', 409);

  const appointment = await Appointment.create(payload);
  res.status(201).json({ success: true, appointment });
});

export const getAppointments = catchAsync(async (req, res) => {
  const { date, status, client } = req.query;
  const filter = { owner: req.user._id };
  if (date) filter.date = date;
  if (status) filter.status = status;
  if (client) filter.client = client;

  const appointments = await Appointment.find(filter).populate('client', 'name phone').sort({ date: 1, time: 1 });
  res.json({ success: true, appointments });
});

export const updateAppointment = catchAsync(async (req, res) => {
  const existing = await Appointment.findOne({ _id: req.params.id, owner: req.user._id });
  if (!existing) throw new AppError('Cita no encontrada', 404);

  const merged = { ...existing.toObject(), ...req.body };
  if (!validateDateInFuture(merged.date, merged.time) && merged.status !== 'completada') {
    throw new AppError('Fecha/hora inválida', 422);
  }
  if (await hasConflict({ owner: req.user._id, date: merged.date, time: merged.time, duration: merged.duration, excludeId: req.params.id })) {
    throw new AppError('Horario no disponible', 409);
  }

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('client', 'name phone');
  res.json({ success: true, appointment });
});

export const deleteAppointment = catchAsync(async (req, res) => {
  const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!appointment) throw new AppError('Cita no encontrada', 404);
  res.json({ success: true, message: 'Cita eliminada' });
});
