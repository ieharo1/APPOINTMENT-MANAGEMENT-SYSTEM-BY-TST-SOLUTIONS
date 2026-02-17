# Appointment Management System by TST Solutions

Sistema SaaS full-stack para control de citas en pequeños negocios (barberías, peluquerías, clínicas, psicólogos, talleres, etc.).

## Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.
- **Frontend:** React + Vite, React Router, Axios, Context API, TailwindCSS, Recharts, Toasts.

## Módulos implementados
- Autenticación segura (registro/login/me/logout frontend), protección de rutas y multi-tenant por `owner`.
- CRUD de clientes con búsqueda e historial de citas.
- CRUD de citas con estados, filtros, validación anti-doble reserva y validación de fecha/hora.
- Calendario visual (día/semana/mes) en vista de citas con colores por estado.
- Control de ingresos + exportación PDF.
- Dashboard con métricas clave y gráfico de ingresos.
- Configuración base para branding y servicios por negocio en modelo de usuario.

## Estructura
- `backend/`: API REST en arquitectura MVC.
- `frontend/`: SPA React responsive, dark mode por defecto.

## Ejecutar en local
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Producción
- Definir secretos reales en `.env`.
- Configurar MongoDB administrado.
- Servir frontend estático detrás de CDN/reverse proxy.
- Escalar API con contenedores y balanceador.
