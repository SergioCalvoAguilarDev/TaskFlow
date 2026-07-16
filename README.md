# TaskFlow

Aplicación de gestión de empleados y tareas con autenticación por roles. Cada empleado accede con sus credenciales para ver y actualizar únicamente sus tareas asignadas; el administrador tiene acceso completo: gestión de usuarios y de todas las tareas.

## Stack

**Backend**
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT para autenticación
- bcryptjs para hash de contraseñas

**Frontend**
- React 19 + Vite
- React Router (rutas protegidas por rol)
- Axios

## Funcionalidades

- Login con JWT y control de acceso por rol (`ADMIN` / `EMPLOYEE`)
- **Empleado:** ve únicamente sus tareas asignadas y puede actualizar su estado (Pendiente / En progreso / Completada)
- **Administrador:**
  - Crear, listar y eliminar usuarios (empleados y otros administradores)
  - Crear tareas y asignarlas a un empleado
  - Ver y eliminar cualquier tarea
- Borrado en cascada: al eliminar un usuario se eliminan automáticamente sus tareas asociadas
- Diseño responsive

## Estructura del proyecto

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

DATABASE_URL="postgresql://usuario:password@localhost:5432/employee_management?schema=public"
JWT_SECRET="un_secreto_largo_y_aleatorio"
PORT=4000

Ejecuta las migraciones y crea el usuario administrador inicial:

```bash
npx prisma migrate dev
npm run seed
```

Esto crea el admin con las credenciales: `admin@empresa.com` / `admin123` (cámbialas después de tu primer login).

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

> Pendiente de completar tras el despliegue. Estructura prevista:

- **Frontend:** Vercel
- **Backend + PostgreSQL:** Render / Railway (pendiente de decidir)

*(Esta sección se actualizará con las URLs reales y los pasos exactos en cuanto el proyecto esté desplegado.)*

## Licencia

Proyecto personal con fines de portfolio.