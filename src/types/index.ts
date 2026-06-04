// ============================================================
// Backend DTO Types — SafeHaven API
// Generado contra los DTOs reales del backend Spring Boot.
// Convenciones: fechas "YYYY-MM-DD", horas "HH:mm".
// ============================================================

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export const ROL = {
  ADMINISTRADOR: 1,
  PSICOLOGO: 3,
  PACIENTE: 4,
} as const;
export type RolId = (typeof ROL)[keyof typeof ROL];

// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
}

// Rol embebido en login/me (objeto completo)
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
}

// Respuesta de POST /auth/login y GET /auth/me
// ⚠️ rol es objeto { id, nombre } SOLO aquí; en entidades es número plano
// ⚠️ fechaNacimiento sin "De" — inconsistencia del backend en este DTO
export interface LoginResponse {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  rol: Rol;
  edad: number | null;
  telefono: string | null;
  sexo: string | null;
  fechaNacimiento: string | null;
  token: string | null;
}

export type UsuarioSesion = Omit<LoginResponse, 'token'>;

// --- Paciente ---
// ⚠️ rol aquí es número (id), NO objeto — distinto del LoginResponse
// ⚠️ fechaDeNacimiento CON "De" — distinto del LoginResponse
export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad: number | null;
  telefono: string | null;
  sexo: string | null;
  fechaDeNacimiento: string | null;
  aseguradora: string | null;
  estadoDeSalud: string | null;
  fechaDeRegistro: string | null;
  rol: number | null;
}

// POST /api/pacientes (público — registro)
export interface RegistroPacienteDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  password: string;
  edad?: number | null;
  telefono?: string | null;
  sexo?: string | null;
  fechaDeNacimiento?: string | null;
  aseguradora?: string | null;
  estadoDeSalud?: string | null;
  rol?: RolId | null;
}

// PUT /api/pacientes/{id} — body = PacienteDto completo, sin password
export interface ActualizarPacienteDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad?: number | null;
  telefono?: string | null;
  sexo?: string | null;
  fechaDeNacimiento?: string | null;
  aseguradora?: string | null;
  estadoDeSalud?: string | null;
  fechaDeRegistro?: string | null;
  rol?: number | null;
}

// --- Psicólogo ---
export interface Psicologo {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad: number | null;
  telefono: string | null;
  sexo: string | null;
  fechaDeNacimiento: string | null;
  especialidad: string | null;
  anosDeExperiencia: number | null;
  horarioDeAtencion: string | null;
  rol: number | null;
}

// POST /api/psicologos (solo admin)
export interface RegistroPsicologoDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  password: string;
  edad?: number | null;
  telefono?: string | null;
  sexo?: string | null;
  fechaDeNacimiento?: string | null;
  especialidad?: string | null;
  anosDeExperiencia?: number | null;
  horarioDeAtencion?: string | null;
  rol: RolId;
}

// PUT /api/psicologos/{id} — backend SÍ aplica rol (envíalo siempre)
export interface ActualizarPsicologoDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad?: number | null;
  telefono?: string | null;
  sexo?: string | null;
  fechaDeNacimiento?: string | null;
  especialidad?: string | null;
  anosDeExperiencia?: number | null;
  horarioDeAtencion?: string | null;
  rol: RolId;
}

// --- Administrador ---
export interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad: number | null;
  telefono: string | null;
  sexo: string | null;
  fechaDeNacimiento: string | null;
  cargo: string | null;
  rol: number | null;
}

// POST /api/administradores (solo admin)
export interface RegistroAdministradorDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  password: string;
  edad?: number | null;
  telefono?: string | null;
  sexo?: string | null;
  fechaDeNacimiento?: string | null;
  cargo?: string | null;
  rol: RolId;
}

// PUT /api/administradores/{id} — backend SÍ aplica rol
export interface ActualizarAdministradorDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad?: number | null;
  telefono?: string | null;
  sexo?: string | null;
  fechaDeNacimiento?: string | null;
  cargo?: string | null;
  rol: RolId;
}

// --- Cita ---
export interface Cita {
  id: number;
  motivo: string;
  duracion: string | null;
  tipoCita: string | null;
  insertBy: string | null;
  updateBy: string | null;
  estado: EstadoCita;
  fecha: string;
  hora: string;
  paciente: number;
  psicologo: number;
  consultorio: number;
}

// POST y PUT /api/citas — estado opcional; backend pone PENDIENTE al crear
export interface CitaDto {
  motivo: string;
  duracion?: string | null;
  tipoCita?: string | null;
  insertBy?: string | null;
  updateBy?: string | null;
  estado?: EstadoCita;
  fecha: string;
  hora: string;
  paciente: number;
  psicologo: number;
  consultorio: number;
}

// --- Consultorio ---
export interface Consultorio {
  id: number;
  nombre: string;
  ubicacion: string | null;
  tipo: string | null;
  capacidad: number | null;
  horarioDeApertura: string | null;
  horarioDeCierre: string | null;
  activo: boolean;
}

export type ConsultorioDto = Omit<Consultorio, 'id'>;

// --- Rol (entidad) ---
export interface RolDto {
  id: number;
  nombre: string;
  descripcion: string | null;
}

// --- API Error ---
export interface ApiErrorResponse {
  status: number;
  message: string;
  errorCode: string;
}
