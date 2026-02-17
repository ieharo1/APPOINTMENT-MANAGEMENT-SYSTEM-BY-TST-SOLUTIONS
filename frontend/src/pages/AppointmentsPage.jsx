import { useEffect, useState } from 'react';
import { http } from '../api/http';

const statusColors = { pendiente: 'bg-yellow-500', confirmada: 'bg-blue-500', cancelada: 'bg-red-500', completada: 'bg-green-500' };

export const AppointmentsPage = () => {
  const [view, setView] = useState('dia');
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '', client: '' });
  const [form, setForm] = useState({ client: '', service: '', date: '', time: '', duration: 60, price: 0, notes: '' });

  const load = () => http.get('/appointments', { params: filters }).then((res) => setAppointments(res.data.appointments));
  useEffect(() => {
    http.get('/clients').then((res) => setClients(res.data.clients));
  }, []);
  useEffect(() => { load(); }, [filters]);

  const save = async (e) => {
    e.preventDefault();
    await http.post('/appointments', form);
    load();
  };


  const grouped = appointments.reduce((acc, a) => {
    const key = view === 'mes' ? a.date.slice(0, 7) : view === 'semana' ? `${a.date.slice(0, 8)}W` : a.date;
    acc[key] = acc[key] || [];
    acc[key].push(a);
    return acc;
  }, {});

  const patchStatus = async (id, status) => {
    await http.put(`/appointments/${id}`, { status });
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={save} className="card grid md:grid-cols-4 gap-2">
        <select className="input" onChange={(e) => setForm({ ...form, client: e.target.value })}>{clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
        <input className="input" placeholder="Servicio" onChange={(e) => setForm({ ...form, service: e.target.value })} />
        <input className="input" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="input" type="time" onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <input className="input" type="number" placeholder="Duración" onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Precio" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <textarea className="input md:col-span-2" placeholder="Notas" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn bg-indigo-500">Agendar</button>
      </form>

      <div className="card grid md:grid-cols-3 gap-2">
        <input className="input" type="date" onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        <select className="input" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Estado</option><option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="cancelada">Cancelada</option><option value="completada">Completada</option>
        </select>
        <select className="input" onChange={(e) => setFilters({ ...filters, client: e.target.value })}><option value="">Cliente</option>{clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      </div>

      <div className="card flex gap-2">
        <button className="btn bg-slate-800" onClick={() => setView('dia')}>Vista diaria</button>
        <button className="btn bg-slate-800" onClick={() => setView('semana')}>Vista semanal</button>
        <button className="btn bg-slate-800" onClick={() => setView('mes')}>Vista mensual</button>
      </div>

      {Object.entries(grouped).map(([bucket, items]) => (
        <section key={bucket} className="space-y-2">
          <h3 className="text-sm text-slate-400 uppercase">{bucket}</h3>
          <div className="grid md:grid-cols-2 gap-3">
        {items.map((a) => (
          <article key={a._id} className="card">
            <p className="font-semibold">{a.client?.name} - {a.service}</p>
            <p>{a.date} {a.time} · {a.duration} min · ${a.price}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${statusColors[a.status]}`}>{a.status}</span>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => patchStatus(a._id, 'confirmada')}>Confirmar</button>
              <button onClick={() => patchStatus(a._id, 'completada')}>Completar</button>
              <button onClick={() => patchStatus(a._id, 'cancelada')}>Cancelar</button>
            </div>
          </article>
        ))}
          </div>
        </section>
      ))}
    </div>
  );
};
