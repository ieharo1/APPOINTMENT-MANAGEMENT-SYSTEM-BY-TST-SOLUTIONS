import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ mode = 'login' }) => {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '', phone: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'register') await register(form);
      else await login(form.email, form.password);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error de autenticación');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-3">
        <h1 className="text-xl font-bold">{mode === 'register' ? 'Crear cuenta' : 'Ingresar'}</h1>
        {mode === 'register' && (
          <>
            <input className="input" placeholder="Nombre" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Negocio" onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            <input className="input" placeholder="Teléfono" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </>
        )}
        <input className="input" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn bg-indigo-500">Continuar</button>
      </form>
    </div>
  );
};
