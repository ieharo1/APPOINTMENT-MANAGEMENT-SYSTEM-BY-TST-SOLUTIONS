import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
