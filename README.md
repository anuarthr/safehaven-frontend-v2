# 🧠 SafeHaven - Frontend

SPA en React + TypeScript para la gestión de una clínica de psicología — pacientes, psicólogos, administradores, citas y consultorios - con autenticación JWT y experiencia diferenciada por rol.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)

Proyecto frontend construido con Vite siguiendo una arquitectura de tres capas (`api/ → hooks/ → pages/`), pensado como cliente mantenible y tipado para el backend Spring Boot de SafeHaven. El diseño prioriza separación de responsabilidades, formularios controlados con validación estricta y un contrato de API completamente alineado con los DTOs del backend.

---

## ✨ Características destacadas

- 🔐 **Autenticación stateless con JWT** - login y `/me` para rehidratación de sesión; token en `localStorage`, adjuntado automáticamente en cada petición mediante interceptor de Axios.
- 🛡️ **Rutas protegidas por rol** - `ProtectedRoute` acepta un array de IDs de rol; redirige al login si la sesión es inválida o los permisos son insuficientes.
- 👤 **Experiencias diferenciadas por rol** - Pacientes ven su dashboard y solo sus citas. Psicólogos ven agenda y directorio. Administradores tienen CRUD completo sobre todos los recursos.
- 📋 **CRUD completo** para Pacientes, Psicólogos, Administradores, Citas y Consultorios — formularios modales con validación Zod + react-hook-form.
- 🗓️ **Flujo de agendado inteligente** - al crear una cita, valida en tiempo real que la fecha y hora estén dentro del horario de atención del psicólogo seleccionado.
- 📱 **Responsive design** - tablas con columnas progresivas (Bootstrap breakpoints `d-none d-md-table-cell`); formularios en grid de 2 columnas que colapsan en mobile.
- 🔔 **Notificaciones toast** - feedback inmediato en creación, edición y eliminación (react-hot-toast, posición top-right, 4 s).
- ⚡ **Estado del servidor con React Query** - stale time de 30 s, invalidación automática tras mutaciones, sin Redux ni Zustand.

---

## 🧰 Stack tecnológico

| Categoría      | Tecnologías                                               |
| --------------- | ---------------------------------------------------------- |
| Lenguaje        | TypeScript 5                                               |
| Framework       | React 18 + Vite 5                                          |
| Routing         | React Router DOM v6                                        |
| Estado servidor | TanStack React Query v5                                    |
| Formularios     | react-hook-form v7 + Zod v4                                |
| HTTP            | Axios (interceptor JWT + manejo 401/403)                   |
| UI principal    | Bootstrap 5 + react-bootstrap                              |
| UI avanzada     | PrimeReact v10 (Calendar) + PrimeIcons                     |
| Iconos          | Lucide React                                               |
| Notificaciones  | react-hot-toast                                            |
| Linting         | ESLint + @typescript-eslint (cero advertencias permitidas) |

---

## 🏗️ Arquitectura

Flujo de una operación desde la UI hasta el backend:

```
Componente de página
      ↓  llama a hook
  hooks/use*.ts           ← React Query (useQuery / useMutation)
      ↓  llama a función de API
  api/*.ts                ← Funciones tipadas que usan apiClient (Axios)
      ↓  petición HTTP con Bearer token
  Backend Spring Boot     ← http://localhost:8080/api
```

| Capa          | Directorio             | Responsabilidad                                                           |
| ------------- | ---------------------- | ------------------------------------------------------------------------- |
| API           | `src/api/`           | Funciones axios tipadas por recurso (`getCitas`, `createCita`, …)    |
| Hooks         | `src/hooks/`         | Wrappers React Query; mutaciones invalidan queries relacionadas           |
| Páginas      | `src/pages/`         | Componentes de página; consumen hooks directamente                       |
| Contexto      | `src/contexts/`      | `AuthContext` — sesión del usuario en memoria + token en localStorage |
| Tipos         | `src/types/index.ts` | Interfaces TypeScript alineadas 1:1 con los DTOs del backend              |
| UI compartida | `src/components/ui/` | `FormField`, `Spinner`, `EmptyState`, `ConfirmModal`              |

### Modelo de autenticación

`AuthContext` valida el token existente al montar con `GET /auth/me` y rehidrata el estado sin requerir nuevo login. Al iniciar sesión, el token JWT se almacena en `localStorage`; el interceptor de Axios lo adjunta en cada petición. Un 401 limpia la sesión y redirige a `/login`; un 403 rechaza la petición preservando la sesión.

### Roles y acceso

| ID | Rol           | Acceso                                                               |
| -- | ------------- | -------------------------------------------------------------------- |
| 1  | Administrador | CRUD completo — pacientes, psicólogos, admins, citas, consultorios |
| 3  | Psicólogo    | Lectura de agenda y directorio, sin edición ni eliminación         |
| 4  | Paciente      | Dashboard propio, perfil editable, agendar y ver sus propias citas   |

---

## 🚀 Puesta en marcha

**Requisitos:** Node 18+ y el backend SafeHaven corriendo en `http://localhost:8080`.

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo (puerto 5173)
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

**Credenciales de prueba (datos de ejemplo del backend):**

| Correo                        | Contraseña      | Rol           |
| ----------------------------- | ---------------- | ------------- |
| `admin@safehaven.com`       | `admin123`     | Administrador |
| `juan.garcia@safehaven.com` | `psicologo123` | Psicólogo    |

---

## 📖 Flujos principales

### Autenticación

```
POST /api/auth/login   { email, password }  →  { id, nombre, rol: { id, nombre }, token, … }
GET  /api/auth/me      (Bearer token)        →  mismo shape, token: null
```

> ⚠️ El campo `rol` en la respuesta de login es un **objeto** `{ id, nombre }`. En todos los demás DTOs (`PacienteDto`, `PsicologoDto`, `AdministradorDto`) `rol` es un **número** (Long). Esta asimetría está reflejada en `src/types/index.ts`.

### Registro de paciente (público)

`POST /api/pacientes` no requiere token. `SignUpPage` calcula la edad a partir de `fechaDeNacimiento` y siempre envía `rol: 4`.

### Creación de citas con validación de horario

Al seleccionar un psicólogo, `CitasPage` valida en tiempo real que:

- El día de la semana elegido coincida con los días de atención del psicólogo.
- La hora esté dentro del rango de atención (parseado del campo `horarioDeAtencion` con expresiones regulares).

La duración se normaliza a formato `HH:mm` antes de enviarse al backend.

### Recursos y permisos

| Endpoint                 | Lectura        | Escritura                                           |
| ------------------------ | -------------- | --------------------------------------------------- |
| `POST /api/pacientes`  | 🌐 Pública    | Auto-registro sin token                             |
| `/api/pacientes`       | 🔑 Autenticada | PUT: autenticado · DELETE: solo Administrador      |
| `/api/psicologos`      | 🔑 Autenticada | POST/PUT/DELETE: solo Administrador                 |
| `/api/administradores` | 🔑 Autenticada | POST/PUT/DELETE: solo Administrador                 |
| `/api/citas`           | 🔑 Autenticada | POST/PUT: autenticado · DELETE: solo Administrador |
| `/api/consultorios`    | 🔑 Autenticada | POST/PUT/DELETE: solo Administrador                 |
| `/api/roles`           | 🔑 Autenticada | POST/DELETE: solo Administrador                     |

### Manejo de errores

Todos los errores del backend tienen la forma:

```json
{ "status": 400, "message": "…", "errorCode": "VALIDATION_ERROR" }
```

El interceptor de respuesta extrae `message` y lo propaga como `Error`; los hooks de React Query lo capturan y `onError` lo muestra en un toast.

| Código | Situación                                                       |
| ------- | ---------------------------------------------------------------- |
| 400     | Validación: campo inválido o email duplicado                   |
| 401     | Token ausente, inválido o expirado → redirección a `/login` |
| 403     | Autenticado pero sin permisos (sesión preservada)               |
| 409     | Conflicto de integridad de datos                                 |

---

## 📁 Estructura del proyecto

```
src/
├── api/               # Funciones axios por recurso
│   ├── auth.ts        # login, getMe
│   ├── pacientes.ts
│   ├── psicologos.ts
│   ├── administradores.ts
│   ├── citas.ts
│   ├── consultorios.ts
│   └── roles.ts
├── hooks/             # React Query wrappers
│   ├── usePacientes.ts
│   ├── usePsicologos.ts
│   ├── useAdministradores.ts
│   ├── useCitas.ts
│   ├── useConsultorios.ts
│   └── useRoles.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── DashboardPage.tsx              # Vista paciente
│   ├── DashboardPsychologistPage.tsx  # Vista psicólogo y admin
│   ├── pacientes/
│   │   ├── PacientesPage.tsx          # CRUD (solo staff)
│   │   └── PerfilPacientePage.tsx     # Perfil propio del paciente
│   ├── psicologos/
│   │   └── PsicologosPage.tsx
│   ├── administradores/
│   │   └── AdministradoresPage.tsx
│   ├── citas/
│   │   └── CitasPage.tsx
│   ├── consultorios/
│   │   └── ConsultoriosPage.tsx
│   └── public/                        # Páginas informativas sin autenticación
├── contexts/
│   └── authcontext.tsx                # AuthProvider + useAuth
├── components/
│   ├── ProtectedRoute.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── ui/                            # FormField, Spinner, EmptyState, ConfirmModal
├── lib/
│   └── axios.ts                       # apiClient + interceptores JWT
├── types/
│   └── index.ts                       # DTOs TypeScript alineados con el backend
└── App.tsx                            # Árbol de rutas
```

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto (ya incluido) con las siguientes variables:

```env
VITE_API_URL=http://localhost:8080/api
```

| Variable        | Descripción                        | Valor por defecto             |
|-----------------|------------------------------------|-------------------------------|
| `VITE_API_URL`  | URL base del backend               | `http://localhost:8080/api`   |
| Puerto Vite     | Puerto del servidor de desarrollo  | `5173`                        |

El backend debe incluir `http://localhost:5173` en su configuración CORS.

---

## 🛠️ Comandos disponibles

```bash
npm run dev       # Servidor de desarrollo Vite con HMR
npm run build     # Type-check con tsc + build de producción
npm run lint      # ESLint — cero advertencias permitidas
npm run preview   # Preview del build de producción en local
```

---

## 🗺️ Posibles mejoras

- Vista de calendario para la agenda de citas (actualmente tabla).
- Paginación en los listados con React Query + parámetros de URL.
- Refresh token y renovación automática antes del vencimiento del JWT.
- Tests de componentes con Vitest + React Testing Library.
