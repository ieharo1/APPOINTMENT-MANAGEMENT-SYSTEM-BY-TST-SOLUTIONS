import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '../api/http';

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  const load = () => http.get('/clients', { params: { q } }).then((res) => setClients(res.data.clients));
  useEffect(() => { load(); }, [q]);

  const save = async (e) => {
    e.preventDefault();
    await http.post('/clients', form);
    setForm({ name: '', phone: '', email: '', notes: '' });
    load();
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar cliente?')) return;
    try {
      await http.delete(`/clients/${id}`);
      load();
    } catch {
      toast.error('No fue posible eliminar');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <form onSubmit={save} className="card space-y-2">
        <h2 className="font-semibold">Nuevo cliente</h2>
        <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className="input" placeholder="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn bg-indigo-500">Guardar</button>
      </form>
      <section className="card">
        <input className="input mb-3" placeholder="Buscar por nombre o teléfono" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="space-y-2">
          {clients.map((c) => (
            <article key={c._id} className="border border-slate-800 rounded-lg p-3 flex justify-between">
              <div><p>{c.name}</p><p className="text-sm text-slate-400">{c.phone}</p></div>
              <button className="text-red-400" onClick={() => remove(c._id)}>Eliminar</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
