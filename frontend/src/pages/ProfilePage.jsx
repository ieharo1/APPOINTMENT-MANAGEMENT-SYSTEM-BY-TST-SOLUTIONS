import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { http } from '../api/http';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', businessName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || '',
        phone: user.phone || ''
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const res = await http.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser({ ...user, avatarUrl: res.data.avatarUrl });
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      toast.error('Error al subir la imagen');
      setAvatarPreview(user?.avatarUrl || null);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await http.put('/auth/profile', form);
      setUser(res.data.user);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>Configuración</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Administra tu cuenta y preferencias</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', overflowX: 'auto' }}>
        {[
          { id: 'profile', label: 'Mi Perfil', icon: '👤' },
          { id: 'business', label: 'Negocio', icon: '🏪' },
          { id: 'security', label: 'Seguridad', icon: '🔒' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: 'none', background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: activeTab === tab.id ? '#a78bfa' : 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Profile Card */}
          <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Información Personal</h2>
            
            {/* Avatar Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    width: '90px', 
                    height: '90px', 
                    borderRadius: '50%', 
                    background: avatarPreview ? `url(${avatarPreview}) center/cover` : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'white', 
                    fontWeight: '800', 
                    fontSize: '32px',
                    cursor: 'pointer',
                    border: '3px solid rgba(99, 102, 241, 0.5)',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {!avatarPreview && user?.name?.charAt(0).toUpperCase()}
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid #0a0a0f',
                    fontSize: '14px'
                  }}
                >
                  📷
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>{user?.name}</p>
                <p style={{ color: '#64748b', fontSize: '14px' }}>{user?.email}</p>
                <p style={{ color: '#6366f1', fontSize: '12px', marginTop: '4px', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                  Cambiar foto de perfil
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>NOMBRE COMPLETO</label>
                <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>CORREO ELECTRÓNICO</label>
                <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} value={form.email} disabled />
                <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>El correo electrónico no se puede cambiar</p>
              </div>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>TELÉFONO</label>
                <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '16px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '8px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)' }}>
                {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
              </button>
            </form>
          </div>

          {/* Business Card */}
          <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Información del Negocio</h2>
            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>NOMBRE DEL NEGOCIO</label>
                <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} required />
              </div>
              <div style={{ padding: '16px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '12px' }}>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>FECHA DE REGISTRO</p>
                <p style={{ color: 'white', fontWeight: '600' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              </div>
              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '16px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)' }}>
                {loading ? 'GUARDANDO...' : 'ACTUALIZAR NEGOCIO'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Seguridad de la Cuenta</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Contraseña</p>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Último cambio: hace tiempo</p>
              </div>
              <button style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.15)', color: '#a78bfa', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                Cambiar contraseña
              </button>
            </div>
            
            <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '14px' }}>
              <p style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>Sesiones activas</p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Tu cuenta está iniciada en este dispositivo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
