import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    service: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'pendiente'
    },
    paid: { type: Boolean, default: false },
    notes: { type: String, default: '' },
    reminderSentAt: { type: Date, default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

appointmentSchema.index({ owner: 1, date: 1, time: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
