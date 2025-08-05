// src/application/use-cases/student/GetStudents.ts
import { Student, StudentRepositoryPort } from '../../../core/domain/student';

export class GetStudents {
  constructor(private readonly studentRepository: StudentRepositoryPort) {}

  async execute(): Promise<Student[]> {
    const students = await this.studentRepository.getStudents();
    return students;
  }
}
