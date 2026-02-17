import { Appointment } from '../models/appointment.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { buildIncomeReportPdf } from '../services/report.service.js';

export const getIncomeSummary = catchAsync(async (req, res) => {
  const { from, to } = req.query;
  const dateFilter = {};
  if (from || to) {
    dateFilter.date = {};
    if (from) dateFilter.date.$gte = from;
    if (to) dateFilter.date.$lte = to;
  }

  const rows = await Appointment.find({ owner: req.user._id, paid: true, status: 'completada', ...dateFilter }).sort({ date: 1, time: 1 });
  const total = rows.reduce((acc, row) => acc + row.price, 0);

  res.json({ success: true, total, rows });
});

export const exportIncomePdf = catchAsync(async (req, res) => {
  const { from = 'inicio', to = 'hoy' } = req.query;
  const rows = await Appointment.find({ owner: req.user._id, paid: true, status: 'completada' }).sort({ date: 1, time: 1 });
  const total = rows.reduce((acc, row) => acc + row.price, 0);

  const pdf = await buildIncomeReportPdf({
    businessName: req.user.businessName,
    from,
    to,
    total,
    rows
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="income-report.pdf"');
  res.send(pdf);
});
