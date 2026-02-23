# 🟢 TST SOLUTIONS - Appointment Management System

**Appointment Management System** es un sistema SaaS profesional de gestión de citas para pequeños negocios desarrollado por **TST Solutions** ("Te Solucionamos Todo").

---

## 📅 ¿Qué es Appointment Management System?

**Appointment Management System** es un sistema SaaS profesional de gestión de citas para pequeños negocios. Moderno, intuitivo y listo para producción.

> *"Tecnología que funciona. Soluciones que escalan."*

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Registro de usuarios y negocios
- Login con email y contraseña
- Encriptación de contraseñas con bcrypt
- Autenticación con JWT
- Protección de rutas privadas
- Multi-tenant (cada usuario ve solo sus datos)

### 👥 Gestión de Clientes
- Crear, editar y eliminar clientes
- Buscar por nombre o teléfono
- Ver historial de citas del cliente
- Campos: nombre, teléfono, email, notas

### 📅 Gestión de Citas
- Crear, editar, cancelar y completar citas
- Filtro por fecha, estado y cliente
- Validación anti-doble reserva
- Estados: Pendiente, Confirmada, Cancelada, Completada
- Control de pago (pagado/pendiente)

### 📆 Calendario Visual
- Vista mensual, diaria y semanal
- Citas por color según estado
- Click para ver detalles

### 💰 Control de Ingresos
- Registro de pago por cita
- Filtro por rango de fechas
- Total de ingresos
- Exportar a PDF
- Citas completadas/pagadas
- Promedio por cita

### 📊 Dashboard Principal
- Citas del día
- Próximas citas
- Total ingresos del mes
- Total clientes
- Gráfico de ingresos mensuales

### 🎨 Frontend
- Diseño moderno y profesional
- Modo oscuro y modo claro
- Responsive (móvil y escritorio)
- Notificaciones toast
- Confirmación antes de eliminar

---

## 🏗️ Estructura Técnica del Proyecto

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
│   │   └── utils/         # Utilidades
│   └── package.json
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
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** para autenticación
- **bcrypt** para encriptación
- Arquitectura **MVC**

### Frontend
- **React 18** + Vite
- **React Router** para rutas
- **Axios** para HTTP
- **Context API** para estado
- **TailwindCSS** para estilos
- **Recharts** para gráficos

---

## 🎨 Identidad Visual

### Paleta de Colores
- **Primary:** #1E3A5F (Azul profundo)
- **Secondary:** #6366F1 (Indigo)
- **Dark:** #1F2937
- **Background:** #F3F4F6

### Tipografía
- **Títulos:** System Default (Bold)
- **Contenido:** System Default (Regular)

---

## 🏆 Características Técnicas

✅ Diseño 100% responsive  
✅ Interfaz moderna y profesional  
✅ Modo oscuro y claro  
✅ Gráficos interactivos  
✅ Navegación fluida  
✅ Código limpio y escalable  

---

## 🌎 Información de Contacto - TST Solutions

📍 **Quito - Ecuador**

📱 **WhatsApp:** +593 99 796 2747  
💬 **Telegram:** @TST_Ecuador  
📧 **Email:** negocios@tstsolutions.com.ec

🌐 **Web:** https://ieharo1.github.io/TST-SOLUTIONS/
📘 **Facebook:** https://www.facebook.com/tstsolutionsecuador/  
🐦 **Twitter/X:** https://x.com/SolutionsT95698

---

## 📋 Requisitos del Sistema

- **Node.js:** 18+
- **MongoDB:** Local o MongoDB Atlas
- **Frontend:** Navegador moderno

---

## 🔑 Credenciales de Prueba

- **Email:** admin@tst.com
- **Password:** admin123

---

## 📄 Licencia

© 2026 Appointment Management System by TST SOLUTIONS - Todos los derechos reservados.

---

## 👨‍💻 Desarrollado por TST SOLUTIONS

*Technology that works. Solutions that scale.*

---

<div align="center">
  <p><strong>TST Solutions</strong> - Te Solucionamos Todo</p>
</div>
