import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '../api/http';

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientHistory, setClientHistory] = useState([]);

  const load = () => http.get('/clients', { params: { q } }).then((res) => setClients(res.data.clients));
  useEffect(() => { load(); }, [q]);

  const loadHistory = async (clientId) => {
    try {
      const res = await http.get(`/clients/${clientId}/history`);
      setClientHistory(res.data.appointments || []);
    } catch { setClientHistory([]); }
  };

  const openHistory = async (client) => {
    setSelectedClient(client);
    await loadHistory(client._id);
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await http.put(`/clients/${editingId}`, form);
        toast.success('Cliente actualizado correctamente');
      } else {
        await http.post('/clients', form);
        toast.success('Cliente creado correctamente');
      }
      setForm({ name: '', phone: '', email: '', notes: '' });
      setEditingId(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally { setLoading(false); }
  };

  const edit = (client) => {
    setForm({ name: client.name, phone: client.phone, email: client.email, notes: client.notes || '' });
    setEditingId(client._id);
  };

  const cancelEdit = () => {
    setForm({ name: '', phone: '', email: '', notes: '' });
    setEditingId(null);
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar cliente? También se eliminarán sus citas.')) return;
    try {
      await http.delete(`/clients/${id}`);
      toast.success('Cliente eliminado');
      load();
    } catch { toast.error('No fue posible eliminar'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>Clientes</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Gestiona tu base de clientes</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Form */}
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>
              {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            {editingId && (
              <button onClick={cancelEdit} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
            )}
          </div>
          
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>NOMBRE *</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>TELÉFONO</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} placeholder="Número de teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>EMAIL</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} placeholder="correo@ejemplo.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>NOTAS</label>
              <textarea style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none', minHeight: '100px', resize: 'vertical' }} placeholder="Notas sobre el cliente" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '16px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '8px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)' }}>
              {loading ? 'GUARDANDO...' : editingId ? 'ACTUALIZAR CLIENTE' : 'CREAR CLIENTE'}
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>Lista de Clientes</h2>
            <span style={{ color: '#64748b', fontSize: '14px' }}>{clients.length} clientes</span>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
            <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px 14px 48px', color: 'white', fontSize: '14px', outline: 'none' }} placeholder="Buscar por nombre o teléfono..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
            {clients.length > 0 ? clients.map((c) => (
              <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '14px', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '18px' }}>
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{c.name}</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>{c.phone} {c.email && `• ${c.email}`}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
                  <button onClick={() => openHistory(c)} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', cursor: 'pointer', fontSize: '16px' }} title="Ver historial">📋</button>
                  <button onClick={() => edit(c)} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', cursor: 'pointer', fontSize: '16px' }} title="Editar">✏️</button>
                  <button onClick={() => remove(c._id)} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', cursor: 'pointer', fontSize: '16px' }} title="Eliminar">🗑️</button>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <p style={{ color: '#64748b', fontSize: '16px' }}>No se encontraron clientes</p>
                <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>Crea tu primer cliente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedClient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#151525', borderRadius: '24px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '800' }}>Historial de Citas</h2>
                <p style={{ color: '#94a3b8', marginTop: '4px' }}>{selectedClient.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '24px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clientHistory.length > 0 ? clientHistory.map((apt) => (
                <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '14px' }}>
                  <div>
                    <p style={{ color: 'white', fontWeight: '600' }}>{apt.service}</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>{apt.date} a las {apt.time}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#34d399', fontWeight: '700' }}>${apt.price}</p>
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: apt.status === 'completada' ? 'rgba(16, 185, 129, 0.2)' : apt.status === 'cancelada' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: apt.status === 'completada' ? '#34d399' : apt.status === 'cancelada' ? '#f87171' : '#fbbf24' }}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>No hay citas registradas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
