// src/application/use-cases/attendance/GetAttendanceHistory.ts

// Importamos el puerto del repositorio de asistencia, la entidad de registro de asistencia y los filtros del dominio.
import { AttendanceRecord, AttendanceFilters, AttendanceRepositoryPort } from '../../../core/domain/attendance';

// Define la clase del caso de uso para obtener el historial de asistencia
export class GetAttendanceHistory {
  constructor(private readonly attendanceRepository: AttendanceRepositoryPort) {}

  // Método para ejecutar el caso de uso
  // Recibe un objeto de filtros opcional
  async execute(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
    // Aquí puedes añadir lógica de negocio adicional para los filtros, por ejemplo:
    // - Normalizar los rangos de fechas.
    // - Validar que los filtros sean coherentes.
    // - Lógica de paginación si no es manejada directamente por el repositorio.

    // Llama al método 'getAttendanceHistory' del repositorio (a través de su puerto)
    const records = await this.attendanceRepository.getAttendanceHistory(filters);

    // Podrías ordenar los registros aquí si el repositorio no garantiza un orden específico.

    return records;
  }
}