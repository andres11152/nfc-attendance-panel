// --- Tipos de apoyo ---
export interface AttendanceStudent {
  id: string;
  name: string;
  lastName: string;
  nfcId: string;
  createdAt?: string;
}

// --- Entidad principal (lo que retorna el backend) ---
export interface AttendanceRecord {
  id: string;
  student: AttendanceStudent;
  type: 'entry' | 'exit';     // O como esté en tu dominio
  timestamp: string;
}

// --- DTO para registrar asistencia ---
// src/core/domain/attendance.ts
export interface AttendanceRegisterDto {
  /* ► cuando registras desde NFC directo                          */
  nfcId?:     string;                   // ← sigue siendo válido
  /* ► cuando ya conoces al estudiante (p.ej. después de la búsqueda) */
  studentId?: string;                   // ← NUEVO
  status?:    'Presente' | 'Ausente' | 'Tardanza' | 'Justificado';
}


// --- Opcional: filtros para consultas ---
export interface AttendanceFilters {
  studentId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Presente' | 'Ausente' | 'Tardanza' | 'Justificado';
}

// --- PUERTO PRINCIPAL ---
export interface AttendanceRepositoryPort {
  // Consulta el historial con filtros opcionales
  getAttendanceHistory(filters?: AttendanceFilters): Promise<AttendanceRecord[]>;

  // Registra asistencia (debe retornar el AttendanceRecord completo, con student)
  recordAttendance(data: AttendanceRegisterDto): Promise<AttendanceRecord>;

  // Consulta registro puntual por ID
  getAttendanceRecordById(id: string): Promise<AttendanceRecord | undefined>;

  // Puedes agregar más métodos según el dominio: update, delete, etc.
}
