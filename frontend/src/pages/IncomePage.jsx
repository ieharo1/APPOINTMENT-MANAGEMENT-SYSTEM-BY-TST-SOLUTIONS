import { useEffect, useState } from 'react';
import { http } from '../api/http';

export const IncomePage = () => {
  const [summary, setSummary] = useState({ total: 0, rows: [] });
  const [range, setRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    http.get('/income', { params: range })
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [range.from, range.to]);

  const exportPdf = async () => {
    try {
      const response = await http.get('/income/export/pdf', { params: range, responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'informe-ingresos.pdf';
      link.click();
    } catch (error) {
      console.error('Error exportando PDF:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>Ingresos</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Controla tus ingresos y ganancias</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Filters Card */}
        <div style={{ gridColumn: 'span 2', background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>DESDE</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
            </div>
            
            <div style={{ flex: '1 1 180px' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>HASTA</label>
              <input style={{ width: '100%', background: 'rgba(30, 30, 50, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '14px', outline: 'none' }} type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
            </div>

            <div style={{ flex: '1 1 180px' }}>
              <button onClick={exportPdf} style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '14px 20px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)' }}>
                📄 Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '24px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Total Cobrado</p>
          <p style={{ color: 'white', fontSize: '36px', fontWeight: '800' }}>${summary.total.toLocaleString()}</p>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
            {range.from && range.to 
              ? `${formatDate(range.from)} - ${formatDate(range.to)}`
              : 'Período completo'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Table */}
        <div style={{ gridColumn: 'span 2', background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Fecha</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Servicio</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Estado</th>
                  <th style={{ textAlign: 'right', padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Cargando...</td>
                  </tr>
                ) : summary.rows.length > 0 ? (
                  summary.rows.map((row) => (
                    <tr key={row._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '16px', color: 'white', fontSize: '14px' }}>{formatDate(row.date)}</td>
                      <td style={{ padding: '16px', color: 'white', fontSize: '14px' }}>{row.client?.name || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#94a3b8', fontSize: '14px' }}>{row.service}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: row.status === 'completada' ? 'rgba(16, 185, 129, 0.15)' : row.paid ? 'rgba(96, 165, 250, 0.15)' : 'rgba(251, 191, 36, 0.15)', color: row.status === 'completada' ? '#34d399' : row.paid ? '#60a5fa' : '#fbbf24' }}>
                          {row.status === 'completada' ? 'Completada' : row.paid ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#34d399', fontWeight: '600', fontSize: '14px' }}>${row.price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                      No hay ingresos en este período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Resumen</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Citas completadas</span>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{summary.rows.filter(r => r.status === 'completada').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Citas pagadas</span>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{summary.rows.filter(r => r.paid).length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Promedio por cita</span>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                  ${summary.rows.length > 0 ? Math.round(summary.total / summary.rows.length).toLocaleString() : 0}
                </span>
              </div>
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>Total</span>
                <span style={{ color: '#34d399', fontWeight: '800', fontSize: '20px' }}>${summary.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Acciones rápidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setRange({ from: '', to: '' })} style={{ padding: '14px 18px', borderRadius: '12px', border: 'none', background: 'rgba(51, 65, 85, 0.5)', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                📅 Ver todo el período
              </button>
              <button onClick={() => {
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                setRange({ from: firstDay.toISOString().split('T')[0], to: now.toISOString().split('T')[0] });
              }} style={{ padding: '14px 18px', borderRadius: '12px', border: 'none', background: 'rgba(51, 65, 85, 0.5)', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                📆 Este mes
              </button>
              <button onClick={() => {
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                setRange({ from: yesterday.toISOString().split('T')[0], to: yesterday.toISOString().split('T')[0] });
              }} style={{ padding: '14px 18px', borderRadius: '12px', border: 'none', background: 'rgba(51, 65, 85, 0.5)', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                📆 Ayer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
