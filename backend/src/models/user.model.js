import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    businessName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: '' },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    serviceDurationDefault: { type: Number, default: 60 },
    services: [
      {
        name: { type: String, required: true },
        duration: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
