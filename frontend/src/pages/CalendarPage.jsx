import { useState, useEffect } from 'react';
import { http } from '../api/http';

const statusColors = {
  pendiente: { bg: '#fbbf24', text: '#000' },
  confirmada: { bg: '#60a5fa', text: '#fff' },
  completada: { bg: '#34d399', text: '#000' },
  cancelada: { bg: '#64748b', text: '#fff' }
};

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    http.get('/appointments', { 
      params: { 
        dateFrom: firstDay.toISOString().split('T')[0],
        dateTo: lastDay.toISOString().split('T')[0]
      } 
    }).then((res) => setAppointments(res.data.appointments));
  }, [currentDate]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Días del mes anterior
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Días del siguiente mes
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(a => a.date === dateStr);
  };

  const today = new Date().toISOString().split('T')[0];

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>Calendario</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Vista general de tus citas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }} className="calendar-grid">
        {/* Calendar */}
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={prevMonth} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(51, 65, 85, 0.5)', color: 'white', fontSize: '18px', cursor: 'pointer' }}>←</button>
              <button onClick={() => setCurrentDate(new Date())} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.15)', color: '#a78bfa', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Hoy</button>
              <button onClick={nextMonth} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(51, 65, 85, 0.5)', color: 'white', fontSize: '18px', cursor: 'pointer' }}>→</button>
            </div>
          </div>

          {/* Day names */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {dayNames.map((day) => (
              <div key={day} style={{ textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {getDaysInMonth().map((day, i) => {
              const dateStr = day.date.toISOString().split('T')[0];
              const dayAppointments = getAppointmentsForDate(day.date);
              const isToday = dateStr === today;
              const isSelected = selectedDate && dateStr === selectedDate.toISOString().split('T')[0];

              return (
                <div 
                  key={i}
                  onClick={() => setSelectedDate(day.date)}
                  style={{ 
                    minHeight: '80px', 
                    padding: '8px', 
                    borderRadius: '12px', 
                    background: isToday ? 'rgba(99, 102, 241, 0.15)' : isSelected ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    border: isToday ? '2px solid #6366f1' : isSelected ? '2px solid #8b5cf6' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    color: day.isCurrentMonth ? 'white' : '#475569', 
                    fontSize: '14px', 
                    fontWeight: isToday ? '700' : '500',
                    marginBottom: '4px'
                  }}>
                    {day.date.getDate()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dayAppointments.slice(0, 3).map((apt, j) => (
                      <div 
                        key={j}
                        style={{ 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          background: statusColors[apt.status]?.bg || '#64748b',
                          color: statusColors[apt.status]?.text || '#fff',
                          fontSize: '10px',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {apt.time} {apt.client?.name}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div style={{ color: '#64748b', fontSize: '10px', textAlign: 'center' }}>
                        +{dayAppointments.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
            {Object.entries(statusColors).map(([status, colors]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: colors.bg }} />
                <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'capitalize' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected day details */}
        <div style={{ background: 'rgba(21, 25, 37, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', height: 'fit-content' }}>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
            {selectedDate ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Selecciona un día'}
          </h3>
          
          {selectedDate && selectedAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedAppointments.map((apt) => (
                <div key={apt._id} style={{ padding: '16px', background: 'rgba(30, 30, 50, 0.6)', borderRadius: '12px', borderLeft: `4px solid ${statusColors[apt.status]?.bg}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{apt.client?.name}</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: statusColors[apt.status]?.bg, color: statusColors[apt.status]?.text, fontWeight: '600' }}>
                      {apt.status}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>{apt.service}</p>
                  <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '12px' }}>
                    <span>🕐 {apt.time}</span>
                    <span>⏱️ {apt.duration}min</span>
                    <span>💵 ${apt.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>📅</p>
              <p>{selectedDate ? 'No hay citas' : 'Selecciona un día para ver las citas'}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .calendar-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
