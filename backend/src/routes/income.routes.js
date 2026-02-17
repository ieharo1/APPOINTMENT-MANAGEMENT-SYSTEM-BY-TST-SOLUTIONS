import { Router } from 'express';
import { exportIncomePdf, getIncomeSummary } from '../controllers/income.controller.js';

const router = Router();
router.get('/', getIncomeSummary);
router.get('/export/pdf', exportIncomePdf);

export default router;
