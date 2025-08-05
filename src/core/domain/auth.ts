// src/core/domain/auth.ts

// 1. DTO (Data Transfer Object) para las credenciales de inicio de sesión
// Define la estructura de los datos que el usuario envía para autenticarse.
export interface CredentialsDto {
  username: string;
  password: string;
}

// 2. Entidad de Dominio: AuthenticatedUser (o User)
// Representa la información del usuario una vez autenticado.
// No debe contener contraseñas ni información sensible que no deba estar en el frontend.
export interface AuthenticatedUser {
  id: string;
  username: string;
  token: string; // Token de sesión (ej. JWT)
  roles?: string[]; // Roles del usuario
  // Puedes añadir más propiedades relevantes del usuario
}

// 3. Puerto del Dominio (Interface): AuthRepositoryPort
// Define el "contrato" que cualquier implementación de servicio de autenticación debe cumplir.
export interface AuthRepositoryPort {
  login(credentials: CredentialsDto): Promise<AuthenticatedUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthenticatedUser | undefined>; // Para verificar sesión persistente
}