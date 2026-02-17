import { Appointment } from '../models/appointment.model.js';
import { Client } from '../models/client.model.js';
import { catchAsync } from '../utils/catchAsync.js';

const today = () => new Date().toISOString().slice(0, 10);

export const getDashboard = catchAsync(async (req, res) => {
  const owner = req.user._id;
  const monthPrefix = new Date().toISOString().slice(0, 7);

  const [appointmentsToday, upcoming, clientCount, monthIncome, yearlyByMonth] = await Promise.all([
    Appointment.find({ owner, date: today() }).populate('client', 'name').sort({ time: 1 }),
    Appointment.find({ owner, date: { $gte: today() }, status: { $ne: 'cancelada' } }).populate('client', 'name').sort({ date: 1, time: 1 }).limit(5),
    Client.countDocuments({ owner }),
    Appointment.aggregate([
      { $match: { owner, date: { $regex: `^${monthPrefix}` }, status: 'completada', paid: true } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]),
    Appointment.aggregate([
      { $match: { owner, status: 'completada', paid: true } },
      { $group: { _id: { $substr: ['$date', 0, 7] }, total: { $sum: '$price' } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    success: true,
    dashboard: {
      appointmentsToday,
      upcoming,
      monthIncome: monthIncome[0]?.total || 0,
      clientCount,
      monthlyIncomeChart: yearlyByMonth.map((i) => ({ month: i._id, total: i.total }))
    }
  });
});
