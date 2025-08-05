// src/application/use-cases/student/UpdateStudent.ts
import {
  Student,
  UpdateStudentDto,
  StudentRepositoryPort,
} from '../../../core/domain/student';

export class UpdateStudent {
  constructor(private readonly studentRepository: StudentRepositoryPort) {}

  async execute(id: string, data: UpdateStudentDto): Promise<Student> {
    const updatedStudent = await this.studentRepository.updateStudent(id, data);
    return updatedStudent;
  }
}
