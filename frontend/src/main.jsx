import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
      <ToastContainer position="top-right" theme="dark" />
    </AuthProvider>
  </React.StrictMode>
);
