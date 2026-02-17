import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { PrivateRoute } from '../components/PrivateRoute';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ClientsPage } from '../pages/ClientsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { IncomePage } from '../pages/IncomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { CalendarPage } from '../pages/CalendarPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="income" element={<IncomePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
