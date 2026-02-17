import { useEffect, useState } from 'react';
import { http } from '../api/http';

export const IncomePage = () => {
  const [summary, setSummary] = useState({ total: 0, rows: [] });
  const [range, setRange] = useState({ from: '', to: '' });

  const load = () => http.get('/income', { params: range }).then((res) => setSummary(res.data));
  useEffect(() => { load(); }, [range.from, range.to]);

  const exportPdf = async () => {
    const response = await http.get('/income/export/pdf', { params: range, responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'income-report.pdf';
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="card flex gap-2">
        <input className="input" type="date" onChange={(e) => setRange({ ...range, from: e.target.value })} />
        <input className="input" type="date" onChange={(e) => setRange({ ...range, to: e.target.value })} />
        <button className="btn bg-indigo-500" onClick={exportPdf}>Exportar PDF</button>
      </div>
      <div className="card">
        <h2 className="text-xl">Total cobrados: ${summary.total}</h2>
      </div>
    </div>
  );
};
