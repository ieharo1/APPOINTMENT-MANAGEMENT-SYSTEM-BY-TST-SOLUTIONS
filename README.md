# 📅 Appointment Management System

Sistema SaaS profesional de gestión de citas para pequeños negocios. Moderno, intuitivo y listo para producción.

---

## 🎯 Características Principales

### 🔐 Autenticación y Seguridad
- ✅ Registro de usuarios y negocios
- ✅ Login con email y contraseña
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación con JWT
- ✅ Protección de rutas privadas
- ✅ Logout seguro
- ✅ Manejo de tokens
- ✅ Multi-tenant (cada usuario ve solo sus datos)

### 👥 Gestión de Clientes
- ✅ Crear cliente
- ✅ Editar cliente
- ✅ Eliminar cliente
- ✅ Buscar por nombre o teléfono
- ✅ Ver historial de citas del cliente
- ✅ Campos: nombre, teléfono, email, notas, fecha de registro

### 📅 Gestión de Citas
- ✅ Crear cita
- ✅ Editar cita
- ✅ Cancelar cita
- ✅ Marcar como completada
- ✅ Filtro por fecha
- ✅ Filtro por estado
- ✅ Filtro por cliente
- ✅ Validación anti-doble reserva
- ✅ Validación de fechas pasadas
- ✅ Estados: Pendiente, Confirmada, Cancelada, Completada
- ✅ Control de pago (pagado/pendiente)

### 📆 Calendario Visual
- ✅ Vista mensual
- ✅ Vista diaria
- ✅ Vista semanal
- ✅ Citas por color según estado
- ✅ Click para ver detalles

### 💰 Control de Ingresos
- ✅ Registro de pago por cita
- ✅ Estado de pago (Pagado/Pendiente)
- ✅ Filtro por rango de fechas
- ✅ Total de ingresos
- ✅ Exportar a PDF
- ✅ Citas completadas/pagadas
- ✅ Promedio por cita

### 📊 Dashboard Principal
- ✅ Citas del día
- ✅ Próximas citas
- ✅ Total ingresos del mes
- ✅ Total clientes
- ✅ Gráfico de ingresos mensuales
- ✅ Estado de citas (pie chart)

### 🎨 Frontend
- ✅ Diseño moderno y profesional
- ✅ Modo oscuro (dark mode)
- ✅ Modo claro (light mode)
- ✅ Responsive (móvil y escritorio)
- ✅ Notificaciones toast
- ✅ Confirmación antes de eliminar
- ✅ Protección de rutas

### ⚙️ Perfil y Configuración
- ✅ Información personal editable
- ✅ Cambio de foto de perfil
- ✅ Información del negocio
- ✅ Configuración de seguridad
- ✅ Tema oscuro/claro persistente

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** para autenticación
- **bcrypt** para encriptación
- Arquitectura **MVC**
- Middlewares de validación
- Manejo centralizado de errores

### Frontend
- **React 18** + Vite
- **React Router** para rutas
- **Axios** para HTTP
- **Context API** para estado
- **TailwindCSS** para estilos
- **Recharts** para gráficos
- **React Toastify** para notificaciones

---

## 📁 Estructura del Proyecto

```
APPOINTMENT-MANAGEMENT-SYSTEM/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración DB y entorno
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos MongoDB
│   │   ├── routes/         # Rutas API
│   │   ├── middlewares/    # Auth, errores, validaciones
│   │   ├── services/       # Servicios adicionales
│   │   └── utils/          # Utilidades
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Configuración HTTP
│   │   ├── components/   # Componentes
│   │   ├── context/      # Contextos React
│   │   ├── layouts/      # Layouts principales
│   │   ├── pages/        # Páginas
│   │   ├── router/       # Rutas
│   │   └── styles/       # Estilos CSS
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+
- MongoDB (local o MongoDB Atlas)

### 1. Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tu configuración:
# MONGO_URI=mongodb://localhost:27017/appointments_saas
# JWT_SECRET=tu_secreto_aqui
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

### 🔑 Credenciales de Prueba
- **Email:** admin@tst.com
- **Password:** admin123

---

## 📋 Modelos de Datos

### User (Usuario)
```javascript
{
  name: String,
  email: String (único),
  password: String (hash),
  businessName: String,
  phone: String,
  logoUrl: String,
  workingHours: { start: String, end: String },
  serviceDurationDefault: Number,
  services: [{ name, duration, price }],
  createdAt: Date,
  updatedAt: Date
}
```

### Client (Cliente)
```javascript
{
  name: String,
  phone: String,
  email: String,
  notes: String,
  owner: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment (Cita)
```javascript
{
  client: ObjectId (Client),
  service: String,
  date: String,
  time: String,
  duration: Number,
  price: Number,
  status: String (pendiente/confirmada/cancelada/completada),
  paid: Boolean,
  notes: String,
  owner: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Características Visuales

- ✅ Diseño moderno y profesional
- ✅ Gradientesmorados e indigo
- ✅ Modo oscuro por defecto
- ✅ Tema claro disponible
- ✅ UI completamente responsive
- ✅ Animaciones y transiciones suaves
- ✅ Iconos y emojis integrados
- ✅ Notificaciones toast elegantes
- ✅ Tarjetas con efecto glassmorphism
- ✅ Gráficos interactivos

---

## 📄 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Datos del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/upload-avatar` - Subir avatar

### Clientes
- `GET /api/clients` - Listar (con búsqueda)
- `POST /api/clients` - Crear
- `PUT /api/clients/:id` - Actualizar
- `DELETE /api/clients/:id` - Eliminar
- `GET /api/clients/:id/history` - Historial de citas

### Citas
- `GET /api/appointments` - Listar (con filtros)
- `POST /api/appointments` - Crear
- `PUT /api/appointments/:id` - Actualizar
- `DELETE /api/appointments/:id` - Eliminar

### Dashboard
- `GET /api/dashboard` - Métricas principales

### Ingresos
- `GET /api/income` - Resumen de ingresos
- `GET /api/income/export/pdf` - Exportar PDF

---

## 🌐 Rutas del Frontend

- `/login` - Login
- `/register` - Registro
- `/` - Dashboard
- `/clients` - Clientes
- `/appointments` - Citas
- `/calendar` - Calendario
- `/income` - Ingresos
- `/profile` - Perfil

---

## 📦 Scripts Disponibles

### Backend
```bash
npm run dev    # Desarrollo
npm start      # Producción
```

### Frontend
```bash
npm run dev    # Desarrollo
npm run build  # Producción
npm run preview # Previsualizar
```

---

## 📝 Licencia

© 2026 **Appointment Management System** - Desarrollado por **TST Solutions**

Todos los derechos reservados. Este software es propiedad de TST Solutions.

---

## 💡 Información

- **Desarrollado por:** TST Solutions
- **Sistema de gestión de citas** para barberías, peluquerías, dentistas, clínicas, psicólogos, talleres y más.
- Diseño moderno, seguro y fácil de usar.
- Listo para vender como SaaS o sistema personalizado.

---

## 🔧 Producción

Para subir a producción:

1. Configurar variables de entorno reales
2. Usar MongoDB Atlas o servidor dedicado
3. Construir frontend: `npm run build`
4. Servir frontend estático
5. Configurar reverse proxy (nginx)
6. SSL/HTTPS con Let's Encrypt
7. Configurar dominio
