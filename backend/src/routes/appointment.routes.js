import { Router } from 'express';
import { body } from 'express-validator';
import { createAppointment, deleteAppointment, getAppointments, updateAppointment } from '../controllers/appointment.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', getAppointments);
router.post(
  '/',
  [body('client').notEmpty(), body('service').notEmpty(), body('date').notEmpty(), body('time').notEmpty(), body('duration').isInt({ min: 1 }), body('price').isFloat({ min: 0 })],
  validateRequest,
  createAppointment
);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
