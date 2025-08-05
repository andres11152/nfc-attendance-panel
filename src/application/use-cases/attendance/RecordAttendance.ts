import {
  AttendanceRecord,
  AttendanceRegisterDto,
  AttendanceRepositoryPort,
} from '../../../core/domain/attendance';
import { StudentRepositoryPort } from '../../../core/domain/student';

export class RecordAttendance {
  constructor(
    private readonly attendanceRepo: AttendanceRepositoryPort,
    private readonly studentsRepo: StudentRepositoryPort,
  ) {}

  async execute(dto: AttendanceRegisterDto): Promise<AttendanceRecord> {
    // ► 1. Determinar el ID del alumno
    let studentId = dto.studentId;

    // Si vino sólo el nfcId, obtener el alumno
    if (!studentId && dto.nfcId) {
      const student = await this.studentsRepo.findByNfcId(dto.nfcId);
      if (!student) throw new Error('Estudiante no encontrado');
      studentId = student.id;
    }

    if (!studentId) throw new Error('Se requiere studentId o nfcId');

    // ► 2. Registrar asistencia usando studentId
    return this.attendanceRepo.recordAttendance({
      studentId,
      status: dto.status ?? 'Presente',
    });
  }
}
