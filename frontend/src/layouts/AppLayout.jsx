import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const profileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/clients', label: 'Clientes', icon: '👥' },
    { path: '/appointments', label: 'Citas', icon: '📅' },
    { path: '/calendar', label: 'Calendario', icon: '📆' },
    { path: '/income', label: 'Ingresos', icon: '💰' },
    { path: '/profile', label: 'Mi Perfil', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  const bgMain = darkMode ? '#0a0a0f' : '#f8fafc';
  const bgCard = darkMode ? 'rgba(21, 25, 37, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const bgNav = darkMode ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const textMain = darkMode ? 'white' : '#1e293b';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const border = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: bgMain, transition: 'background 0.3s' }}>
      {/* Top Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: bgNav, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, transition: 'all 0.3s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Menu Hamburguesa */}
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden" style={{ background: 'transparent', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke={textMuted} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                {/* Logo */}
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <rect width="38" height="38" rx="10" fill="url(#logoGrad)"/>
                  <rect x="7" y="8" width="24" height="22" rx="3" fill="white" fillOpacity="0.25"/>
                  <rect x="10" y="11" width="18" height="2" rx="1" fill="white"/>
                  <rect x="10" y="15" width="12" height="2" rx="1" fill="white" opacity="0.7"/>
                  <rect x="10" y="19" width="6" height="2" rx="1" fill="white" opacity="0.5"/>
                  <path d="M26 26L28 28L32 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="logoGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1"/>
                      <stop offset="1" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="hidden md:inline" style={{ color: textMain, fontWeight: '700', fontSize: '15px', transition: 'color 0.3s' }}>Appointment</span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px' }}>
              {navItems.slice(0, 4).map((item) => (
                <Link key={item.path} to={item.path} style={{ padding: '10px 18px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', background: isActive(item.path) ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: isActive(item.path) ? '#a78bfa' : textMuted }}>
                  <span style={{ marginRight: '6px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Dark/Light Mode Toggle */}
              <button onClick={() => setDarkMode(!darkMode)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${border}`, background: darkMode ? 'rgba(30, 30, 50, 0.8)' : 'rgba(241, 245, 249, 0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                {darkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" stroke="#fbbf24" strokeWidth="2"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: darkMode ? 'rgba(30, 30, 50, 0.8)' : 'rgba(241, 245, 249, 0.8)', border: `1px solid ${border}`, borderRadius: '12px', padding: '8px 14px', cursor: 'pointer', transition: 'all 0.3s' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline" style={{ color: textMain, fontWeight: '600', fontSize: '13px', transition: 'color 0.3s' }}>{user?.businessName}</span>
                  <svg width="16" height="16" fill="none" stroke={textMuted} strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                
                {profileOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: darkMode ? '#151525' : '#ffffff', border: `1px solid ${border}`, borderRadius: '14px', padding: '8px', minWidth: '200px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', textDecoration: 'none', color: textMain, fontWeight: '500', fontSize: '14px' }}>
                      <span>⚙️</span> Mi Perfil
                    </Link>
                    <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontWeight: '500', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
                      <span>🚪</span> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setSidebarOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'absolute', left: 0, top: '72px', bottom: 0, width: '280px', background: darkMode ? '#0f0f1a' : '#ffffff', borderRight: `1px solid ${border}`, padding: '20px' }}>
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '12px', textDecoration: 'none', marginBottom: '8px', background: isActive(item.path) ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: isActive(item.path) ? '#a78bfa' : textMuted, fontWeight: '600' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main style={{ paddingTop: '96px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px', borderTop: `1px solid ${border}`, background: darkMode ? 'rgba(10, 10, 15, 0.8)' : 'rgba(248, 250, 252, 0.8)', transition: 'all 0.3s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
          <p style={{ color: textMuted, fontSize: '12px', transition: 'color 0.3s' }}>
            © 2026 Appointment Management - Desarrollado por <span style={{ color: '#a78bfa' }}>TST Solutions</span>
          </p>
          <p style={{ color: textMuted, fontSize: '11px', opacity: 0.7, transition: 'color 0.3s' }}>
            Sistema de gestión de citas para tu negocio
          </p>
        </div>
      </footer>
    </div>
  );
};
