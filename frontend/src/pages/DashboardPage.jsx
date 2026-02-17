import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { http } from '../api/http';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get('/dashboard')
      .then((res) => { setData(res.data.dashboard); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #334155', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8' }}>Cargando dashboard...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = [
    { title: 'Citas de Hoy', value: data?.appointmentsToday?.length || 0, icon: '📅', color: '#6366f1' },
    { title: 'Próximas Citas', value: data?.upcoming?.length || 0, icon: '⏰', color: '#f59e0b' },
    { title: 'Ingresos del Mes', value: `$${(data?.monthIncome || 0).toLocaleString()}`, icon: '💰', color: '#10b981' },
    { title: 'Total Clientes', value: data?.clientCount || 0, icon: '👥', color: '#8b5cf6' },
  ];

  const statusData = [
    { name: 'Pendientes', value: data?.appointmentsToday?.filter(a => a.status === 'pendiente').length || 0 },
    { name: 'Confirmadas', value: data?.appointmentsToday?.filter(a => a.status === 'confirmada').length || 0 },
    { name: 'Completadas', value: data?.appointmentsToday?.filter(a => a.status === 'completada').length || 0 },
    { name: 'Canceladas', value: data?.appointmentsToday?.filter(a => a.status === 'cancelada').length || 0 },
  ].filter(d => d.value > 0);

  const TooltipCustom = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px' }}>
          <p style={{ color: '#94a3b8', fontSize: '12px' }}>{label}</p>
          <p style={{ color: '#818cf8', fontWeight: '700', fontSize: '16px' }}>${payload[0].value?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>Dashboard</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Resumen de tu negocio</p>
        </div>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>{stat.title}</p>
                <p style={{ color: 'white', fontSize: '32px', fontWeight: '800', marginTop: '8px' }}>{stat.value}</p>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>Ingresos Mensuales</h3>
            <span style={{ color: '#64748b', fontSize: '13px' }}>Últimos 6 meses</span>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyIncomeChart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<TooltipCustom />} />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>Estado de Citas</h3>
            <span style={{ color: '#64748b', fontSize: '13px' }}>Hoy</span>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px' }}>
                      <p style={{ color: 'white', fontWeight: '600' }}>{payload[0].name}: {payload[0].value}</p>
                    </div>
                  ) : null} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={{ color: '#64748b' }}>No hay citas hoy</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            {statusData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Próximas Citas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.upcoming?.length > 0 ? data.upcoming.slice(0, 5).map((apt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
                  <div>
                    <p style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{apt.client?.name}</p>
                    <p style={{ color: '#64748b', fontSize: '12px' }}>{apt.service}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'white', fontSize: '13px' }}>{apt.date}</p>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>{apt.time}</p>
                </div>
              </div>
            )) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '32px' }}>No hay próximas citas</p>
            )}
          </div>
        </div>

        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Resumen de Ingresos</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyIncomeChart?.slice(-6) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<TooltipCustom />} />
                <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
