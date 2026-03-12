// ============================================================
// Backend DTO Types — SafeHaven API
// ============================================================

export interface Rol {
  id: number;
  nombre: string;
}

// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  rol: number;
}

export type UsuarioSesion = LoginResponse;

// --- Paciente ---
export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad: number;
  telefono: string;
  sexo: string;
  fechaDeNacimiento: string;
  aseguradora: string;
  estadoDeSalud: string;
  fechaDeRegistro: string;
  rol: number;
}

export type RegistroPacienteDto = Omit<Paciente, 'id'> & { password: string };
export type ActualizarPacienteDto = Omit<Paciente, 'id'>;

// --- Psicólogo ---
export interface Psicologo {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad: number;
  telefono: string;
  sexo: string;
  fechaDeNacimiento: string;
  especialidad: string;
  anosDeExperiencia: number;
  horarioDeAtencion: string;
  rol: number;
}

export type RegistroPsicologoDto = Omit<Psicologo, 'id'> & { password: string };
export type ActualizarPsicologoDto = Omit<Psicologo, 'id'>;

// --- Administrador ---
export interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  edad: number;
  telefono: string;
  sexo: string;
  fechaDeNacimiento: string;
  rol: number;
  cargo: string;
}

export type RegistroAdministradorDto = Omit<Administrador, 'id'> & { password: string };
export type ActualizarAdministradorDto = Omit<Administrador, 'id'>;

// --- Cita ---
export interface Cita {
  id: number;
  motivo: string;
  duracion: string; // HH:mm:ss
  tipoCita: string;
  insertBy: string;
  updateBy: string;
  fecha: string;
  hora: string;
  paciente: number;
  psicologo: number;
  consultorio: number;
}

export type CitaDto = Omit<Cita, 'id'>;

// --- Consultorio ---
export interface Consultorio {
  id: number;
  nombre: string;
  ubicacion: string;
  tipo: string;
  capacidad: number;
  horarioDeApertura: string;
  horarioDeCierre: string;
  activo: boolean;
}

export type ConsultorioDto = Omit<Consultorio, 'id'>;

// --- API Error ---
export interface ApiErrorResponse {
  status: number;
  message: string;
  errorCode: string;
}
