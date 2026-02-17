import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import incomeRoutes from './routes/income.routes.js';
import { protect } from './middlewares/auth.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ success: true }));
app.use('/api/auth', authRoutes);
app.use('/api/clients', protect, clientRoutes);
app.use('/api/appointments', protect, appointmentRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/income', protect, incomeRoutes);

app.use(errorMiddleware);
