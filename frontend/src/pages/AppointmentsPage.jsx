import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '../api/http';

const statusConfig = {
  pendiente: { label: 'Pendiente', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', icon: '⏳' },
  confirmada: { label: 'Confirmada', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', icon: '✓' },
  cancelada: { label: 'Cancelada', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', icon: '✕' },
  completada: { label: 'Completada', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', icon: '✓✓' }
};

export const AppointmentsPage = () => {
  const [view, setView] = useState('dia');
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '', client: '' });
  const [form, setForm] = useState({ client: '', service: '', date: '', time: '', duration: 60, price: 0, notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    http.get('/appointments', { params: filters })
      .then((res) => setAppointments(res.data.appointments))
      .catch(() => setAppointments([]));
  };

  useEffect(() => {
    http.get('/clients').then((res) => setClients(res.data.clients));
  }, []);

  useEffect(() => { load(); }, [filters]);

  const resetForm = () => {
    setForm({ client: '', service: '', date: '', time: '', duration: 60, price: 0, notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await http.put(`/appointments/${editingId}`, form);
        toast.success('Cita actualizada correctamente');
      } else {
        await http.post('/appointments', form);
        toast.success('Cita creada correctamente');
      }
      resetForm();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const editAppointment = (apt) => {
    setForm({
      client: apt.client?._id || apt.client,
      service: apt.service,
      date: apt.date,
      time: apt.time,
      duration: apt.duration,
      price: apt.price,
      notes: apt.notes || ''
    });
    setEditingId(apt._id);
    setShowForm(true);
  };

  const deleteAppointment = async (id) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await http.delete(`/appointments/${id}`);
      toast.success('Cita eliminada');
      load();
    } catch {
      toast.error('No fue posible eliminar');
    }
  };

  const patchStatus = async (id, status) => {
    try {
      await http.put(`/appointments/${id}`, { status });
      toast.success(`Cita marcada como ${statusConfig[status].label}`);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar');
    }
  };

  const togglePaid = async (id, currentPaid) => {
    try {
      await http.put(`/appointments/${id}`, { paid: !currentPaid });
      toast.success(!currentPaid ? 'Pago registrado' : 'Pago eliminado');
      load();
    } catch {
      toast.error('Error al actualizar pago');
    }
  };

  const grouped = appointments.reduce((acc, a) => {
    const key = view === 'mes' ? a.date.slice(0, 7) : view === 'semana' ? `${a.date.slice(0, 8)}W` : a.date;
    acc[key] = acc[key] || [];
    acc[key].push(a);
    return acc;
  }, {});

  const formatBucket = (bucket) => {
    if (view === 'mes') {
      const [year, month] = bucket.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
    if (view === 'semana') return `Semana de ${bucket}`;
    return new Date(bucket).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>Citas</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Gestiona tus citas y horarios</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '12px 24px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)' }}>
          {showForm ? '✕ Cancelar' : '+ Nueva Cita'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            {editingId ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>CLIENTE *</label>
              <select style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required>
                <option value="" style={{ color: '#64748b' }}>Seleccionar cliente</option>
                {clients.map((c) => (<option key={c._id} value={c._id} style={{ color: 'white' }}>{c.name}</option>))}
              </select>
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>SERVICIO *</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} placeholder="Nombre del servicio" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} required />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>FECHA *</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} min={today} required />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>HORA *</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>DURACIÓN (MIN)</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} type="number" min="15" step="15" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>PRECIO ($)</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>NOTAS</label>
              <textarea style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none', minHeight: '80px', resize: 'vertical' }} placeholder="Notas adicionales..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '16px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)' }}>
                {loading ? 'GUARDANDO...' : editingId ? 'ACTUALIZAR CITA' : 'CREAR CITA'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Fecha</label>
            <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: 'white', fontSize: '14px', outline: 'none' }} type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          </div>
          
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Estado</label>
            <select style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: 'white', fontSize: '14px', outline: 'none' }} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="" style={{ color: '#64748b' }}>Todos los estados</option>
              <option value="pendiente" style={{ color: 'white' }}>Pendiente</option>
              <option value="confirmada" style={{ color: 'white' }}>Confirmada</option>
              <option value="cancelada" style={{ color: 'white' }}>Cancelada</option>
              <option value="completada" style={{ color: 'white' }}>Completada</option>
            </select>
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Cliente</label>
            <select style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: 'white', fontSize: '14px', outline: 'none' }} value={filters.client} onChange={(e) => setFilters({ ...filters, client: e.target.value })}>
              <option value="" style={{ color: '#64748b' }}>Todos los clientes</option>
              {clients.map((c) => (<option key={c._id} value={c._id} style={{ color: 'white' }}>{c.name}</option>))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[{ v: 'dia', label: 'Diaria' }, { v: 'semana', label: 'Semanal' }, { v: 'mes', label: 'Mensual' }].map((item) => (
            <button key={item.v} onClick={() => setView(item.v)} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', background: view === item.v ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(51, 65, 85, 0.5)', color: 'white', boxShadow: view === item.v ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none' }}>
              Vista {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([bucket, items]) => (
            <div key={bucket}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                {formatBucket(bucket)}
                <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '400' }}>({items.length} {items.length === 1 ? 'cita' : 'citas'})</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {items.map((a) => (
                  <div key={a._id} style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ color: 'white', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{a.client?.name}</h4>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>{a.service}</p>
                      </div>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: statusConfig[a.status]?.bg, color: statusConfig[a.status]?.color }}>
                        {statusConfig[a.status]?.icon} {statusConfig[a.status]?.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                        <span>📅</span> {a.date} <span style={{ marginLeft: '12px' }}>🕐</span> {a.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                        <span>⏱️</span> {a.duration} min <span style={{ marginLeft: '12px' }}>💵</span> 
                        <span style={{ color: a.paid ? '#34d399' : '#94a3b8', fontWeight: '600' }}>${a.price}</span>
                        {a.paid && <span style={{ color: '#34d399', fontSize: '12px' }}>(Pagado)</span>}
                      </div>
                      {a.notes && <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>"{a.notes}"</p>}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {a.status === 'pendiente' && (
                        <button onClick={() => patchStatus(a._id, 'confirmada')} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>✓ Confirmar</button>
                      )}
                      {a.status !== 'completada' && a.status !== 'cancelada' && (
                        <button onClick={() => patchStatus(a._id, 'completada')} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>✓✓ Completar</button>
                      )}
                      {a.status !== 'cancelada' && a.status !== 'completada' && (
                        <button onClick={() => patchStatus(a._id, 'cancelada')} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(248, 113, 113, 0.15)', color: '#f87171', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>✕ Cancelar</button>
                      )}
                      <button onClick={() => togglePaid(a._id, a.paid)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: a.paid ? 'rgba(51, 65, 85, 0.5)' : 'rgba(52, 211, 153, 0.15)', color: a.paid ? '#94a3b8' : '#34d399', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                        {a.paid ? '↩️ No pagado' : '✓ Pagado'}
                      </button>
                      <button onClick={() => editAppointment(a)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>✏️</button>
                      <button onClick={() => deleteAppointment(a._id)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '18px' }}>No se encontraron citas</p>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Crea tu primera cita</p>
          </div>
        )}
      </div>
    </div>
  );
};
