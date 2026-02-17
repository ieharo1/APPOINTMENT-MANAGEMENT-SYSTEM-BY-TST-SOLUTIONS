import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), body('businessName').notEmpty(), body('phone').notEmpty()],
  validateRequest,
  register
);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validateRequest, login);
router.get('/me', protect, me);

export default router;
