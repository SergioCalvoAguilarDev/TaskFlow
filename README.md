# TaskFlow

**[🔗 Ver demo en vivo](https://task-flow-nu-mauve.vercel.app/login)**

Aplicación full-stack de gestión de empleados y tareas, con autenticación por roles: cada empleado accede solo a sus tareas asignadas, mientras que el administrador gestiona usuarios y tareas de toda la organización.

**Credenciales de demo (rol Administrador):**
- Email: `admin@empresa.com`
- Contraseña: `admin123`

> La demo corre en un plan gratuito — si nadie la ha visitado en un rato, la primera carga puede tardar 30-60 segundos en "despertar" el servidor.

## Stack

| | |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios |
| **Backend** | Node.js, Express, JWT, bcrypt |
| **Base de datos** | PostgreSQL + Prisma ORM |
| **Despliegue** | Vercel (frontend) · Render (backend) · Neon (PostgreSQL) |

## Funcionalidades

- Autenticación con JWT y control de acceso por rol (`ADMIN` / `EMPLOYEE`)
- **Empleado:** ve únicamente sus tareas asignadas y actualiza su estado (Pendiente / En progreso / Completada)
- **Administrador:**
  - Crea, lista y elimina usuarios (empleados y otros administradores)
  - Crea tareas y las asigna a un empleado concreto
  - Ve y elimina cualquier tarea de la organización
- Borrado en cascada: eliminar un usuario elimina automáticamente sus tareas asociadas
- Diseño responsive, adaptado a móvil

## Capturas

| Login | Panel de administrador |
|---|---|
| ![Login](./screenshots/login.png) | ![Panel de administrador](./screenshots/admin-panel.png) |

| Dashboard de empleado |
|---|
| ![Dashboard de empleado](./screenshots/employee-dashboard.png) |

## Arquitectura

```
TaskFlow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos User y Task
│   │   ├── seed.js            # Crea el usuario admin inicial
│   │   └── migrations/
│   └── src/
│       ├── index.js           # Punto de entrada del servidor
│       ├── lib/prisma.js      # Cliente de Prisma
│       ├── middleware/        # Autenticación JWT y control de roles
│       └── routes/            # auth, tasks, users
└── frontend/
    └── src/
        ├── api/client.js      # Cliente Axios con token automático
        ├── context/AuthContext.jsx
        ├── components/        # Header, ProtectedRoute
        └── pages/              # Login, EmployeeDashboard, AdminDashboard
```

## Puesta en marcha en local

### Requisitos previos

- Node.js 18+
- PostgreSQL instalado y corriendo

### 1. Clonar el repositorio

```bash
git clone https://github.com/SergioCalvoAguilarDev/TaskFlow.git
cd TaskFlow
```

### 2. Backend

```bash
cd backend
npm install
```

Crea la base de datos:

```sql
CREATE DATABASE employee_management;
```

Copia `.env.example` a `.env` y rellena tus credenciales reales:

```bash
cp .env.example .env
```

```
DATABASE_URL="postgresql://usuario:password@localhost:5432/employee_management?schema=public"
JWT_SECRET="un_secreto_largo_y_aleatorio"
PORT=4000
```

Ejecuta las migraciones y crea el usuario administrador inicial:

```bash
npx prisma migrate dev
npm run seed
```

Arranca el servidor:

```bash
npm run dev
```

El backend queda disponible en `http://localhost:4000`.

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

## Despliegue

| Servicio | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | https://task-flow-nu-mauve.vercel.app |
| Backend | Render | https://taskflow-backend-ejtt.onrender.com |
| Base de datos | Neon (PostgreSQL) | — |

El frontend usa la variable de entorno `VITE_API_URL` para apuntar al backend en producción; en local, cae por defecto a `http://localhost:4000/api`.

## Autor

**Sergio Calvo Aguilar** — [GitHub](https://github.com/SergioCalvoAguilarDev)

Proyecto personal con fines de portfolio.
