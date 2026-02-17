import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ mode = 'login' }) => {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(mode === 'register');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) await register(form);
      else await login(form.email, form.password);
      navigate('/');
      toast.success(isRegister ? '¡Bienvenido! Tu cuenta ha sido creada' : '¡Bienvenido de nuevo!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: '#0a0a0f' }}>
      {/* Left Side - Sales Panel */}
      <div className="hidden lg:flex" style={{ width: '55%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        
        <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" rx="16" fill="url(#paint0_linear)"/>
              <path d="M18 22H38M18 28H32M18 34H26" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="40" cy="36" r="8" fill="white" fillOpacity="0.3"/>
              <path d="M37 36L39 38L42 35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '18px', letterSpacing: '0.5px' }}>Appointment Management</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>Gestión de Citas</p>
            </div>
          </div>

          <div style={{ maxWidth: '520px' }}>
            <h1 style={{ fontSize: '56px', fontWeight: '900', color: 'white', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-1px' }}>
              La plataforma más{' '}
              <span style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                innovadora
              </span>
              <br />para gestionar citas
            </h1>
            
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', marginBottom: '36px', lineHeight: '1.7' }}>
              Miles de negocios ya confían en nosotros. <span style={{ color: 'white', fontWeight: '600' }}>Empieza gratis</span> y lleva tu negocio al siguiente nivel.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '40px' }}>
              {[
                { icon: '🚀', text: 'Prueba gratis 14 días', desc: 'Sin compromiso' },
                { icon: '⚡', text: 'Setup en 2 minutos', desc: 'Sin conocimientos' },
                { icon: '🔒', text: 'Datos 100% seguros', desc: 'Encriptación total' },
                { icon: '💳', text: 'Sin tarjeta de crédito', desc: 'Solo paga si te gusta' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '18px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{item.text}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', paddingLeft: '32px' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex' }}>
                {['JD','MR','AS','KL','PW'].map((u,i) => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #1e1b4b', marginLeft: i > 0 ? '-12px' : '0', background: `linear-gradient(135deg, hsl(${i*50 + 200}, 70%, 60%), hsl(${i*50 + 280}, 60%, 40%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '11px' }}>{u}</div>
                ))}
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>+500 negocios</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>ya lo usan y recomiendan</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', letterSpacing: '1px' }}>© 2026 APPOINTMENT MANAGEMENT - DESARROLLADO POR TST SOLUTIONS</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ width: '100%', lg: { width: '45%' }, background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          {/* Mobile Header */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 20px' }}>
              <rect width="80" height="80" rx="24" fill="url(#paint0_linear2)"/>
              <path d="M24 30H56M24 40H46M24 50H36" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="58" cy="52" r="12" fill="white" fillOpacity="0.3"/>
              <path d="M54 52L57 55L61 51" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear2" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 style={{ color: 'white', fontWeight: '900', fontSize: '32px', letterSpacing: '-0.5px', marginBottom: '4px' }}>Appointment</h1>
            <p style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700', fontSize: '16px' }}>Gestión de Citas</p>
          </div>

          {/* Desktop Welcome */}
          <div className="hidden lg:block" style={{ marginBottom: '36px' }}>
            <h2 style={{ color: 'white', fontWeight: '900', fontSize: '36px', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              {isRegister ? '¡Únete a Nosotros!' : 'Bienvenido de nuevo'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
              {isRegister ? 'Crea tu cuenta y prueba 14 días gratis' : 'Entra a tu panel de control'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', background: 'rgba(30, 30, 50, 0.6)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
            <button type="button" onClick={() => setIsRegister(false)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: !isRegister ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: !isRegister ? 'white' : 'rgba(255,255,255,0.4)', boxShadow: !isRegister ? '0 4px 20px rgba(99, 102, 241, 0.4)' : 'none' }}>
              ENTRAR
            </button>
            <button type="button" onClick={() => setIsRegister(true)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: isRegister ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: isRegister ? 'white' : 'rgba(255,255,255,0.4)', boxShadow: isRegister ? '0 4px 20px rgba(99, 102, 241, 0.4)' : 'none' }}>
              REGISTRARSE
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isRegister && (
              <>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '10px', letterSpacing: '0.5px' }}>NOMBRE COMPLETO</label>
                  <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px 18px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }} placeholder="Ej: Juan García" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '10px', letterSpacing: '0.5px' }}>NOMBRE DEL NEGOCIO</label>
                  <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px 18px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }} placeholder="Ej: Barbería Juan" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} required />
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '10px', letterSpacing: '0.5px' }}>CORREO ELECTRÓNICO</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px 18px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }} placeholder="tu@email.com" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            </div>
            
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '10px', letterSpacing: '0.5px' }}>CONTRASEÑA</label>
              <div style={{ position: 'relative' }}>
                <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px 54px 16px 18px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }} placeholder="••••••••" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: 0.5 }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(99, 102, 241, 0.6)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', padding: '18px', color: 'white', fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '12px', boxShadow: loading ? 'none' : '0 8px 30px rgba(99, 102, 241, 0.5)', transition: 'all 0.3s', letterSpacing: '0.5px' }}>
              {loading ? 'PROCESANDO...' : isRegister ? 'CREAR MI CUENTA' : 'ENTRAR AL SISTEMA'}
            </button>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px', fontWeight: '500' }}>
              {isRegister ? '¿Ya tienes cuenta?' : '¿Sin cuenta?'} <span onClick={() => setIsRegister(!isRegister)} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: '700' }}>{isRegister ? ' Entra aquí' : ' Regístrate gratis'}</span>
            </p>
          </form>

          <div className="lg:hidden" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '1px' }}>© 2026 APPOINTMENT MANAGEMENT<br/><span style={{ color: 'rgba(255,255,255,0.4)' }}>DESARROLLADO POR TST SOLUTIONS</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
