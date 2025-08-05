import { AttendanceRepositoryPort, AttendanceRecord } from '../../../core/domain/attendance';
import { StudentRepositoryPort } from '../../../core/domain/student';

export class RecordAttendanceByNfcId {
  constructor(
    private readonly attendanceRepository: AttendanceRepositoryPort,
    private readonly studentRepository: StudentRepositoryPort
  ) {}

  async execute(nfcId: string): Promise<AttendanceRecord> {
    const student = await this.studentRepository.findByNfcId(nfcId);

    if (!student) {
      throw new Error(`Estudiante con nfcId "${nfcId}" no fue encontrado.`);
    }

    // Llama a recordAttendance con studentId (no nfcId)
    return this.attendanceRepository.recordAttendance({
      studentId: student.id,
      status: 'Presente',
    });
  }
}
