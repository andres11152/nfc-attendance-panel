// src/application/use-cases/student/FindStudentByNfcId.ts
import { Student, StudentRepositoryPort } from '../../../core/domain/student';

export class FindStudentByNfcId {
  constructor(private readonly studentRepository: StudentRepositoryPort) {}

  async execute(nfcId: string): Promise<Student | undefined> {
    const student = await this.studentRepository.findByNfcId(nfcId);
    return student;
  }
}
