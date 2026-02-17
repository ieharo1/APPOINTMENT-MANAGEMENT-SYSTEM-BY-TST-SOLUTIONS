import { Router } from 'express';
import { body } from 'express-validator';
import { createClient, deleteClient, clientHistory, getClients, updateClient } from '../controllers/client.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/', getClients);
router.get('/:id/history', clientHistory);
router.post('/', [body('name').notEmpty(), body('phone').notEmpty()], validateRequest, createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
