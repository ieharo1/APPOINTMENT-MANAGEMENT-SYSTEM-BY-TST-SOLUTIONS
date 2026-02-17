import { createContext, useContext, useEffect, useState } from 'react';
import { http } from '../api/http';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data } = await http.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await http.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const { data } = await http.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
