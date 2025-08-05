// src/application/use-cases/student/DeleteStudent.ts
import { StudentRepositoryPort } from '../../../core/domain/student';

export class DeleteStudent {
  constructor(private readonly studentRepository: StudentRepositoryPort) {}

  async execute(id: string): Promise<void> {
    await this.studentRepository.deleteStudent(id);
  }
}
