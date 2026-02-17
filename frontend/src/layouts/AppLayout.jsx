import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 p-4 flex justify-between items-center">
        <div>
          <p className="font-bold">{user?.businessName}</p>
          <p className="text-xs text-slate-400">{user?.name}</p>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link to="/">Dashboard</Link>
          <Link to="/clients">Clientes</Link>
          <Link to="/appointments">Citas</Link>
          <Link to="/income">Ingresos</Link>
          <button onClick={onLogout}>Salir</button>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};
