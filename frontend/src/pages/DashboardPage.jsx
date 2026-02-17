import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { http } from '../api/http';

export const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    http.get('/dashboard').then((res) => setData(res.data.dashboard));
  }, []);

  if (!data) return <p>Cargando panel...</p>;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card"><p>Citas de hoy</p><h3 className="text-2xl">{data.appointmentsToday.length}</h3></div>
        <div className="card"><p>Próximas</p><h3 className="text-2xl">{data.upcoming.length}</h3></div>
        <div className="card"><p>Ingresos del mes</p><h3 className="text-2xl">${data.monthIncome}</h3></div>
        <div className="card"><p>Clientes</p><h3 className="text-2xl">{data.clientCount}</h3></div>
      </div>
      <div className="card h-72">
        <h2 className="mb-3">Ingresos mensuales</h2>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data.monthlyIncomeChart}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#818cf8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
