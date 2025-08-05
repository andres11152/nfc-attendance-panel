// src/application/use-cases/student/CreateStudent.ts
import {
  Student,
  CreateStudentDto,
  StudentRepositoryPort,
} from '../../../core/domain/student';

export class CreateStudent {
  constructor(private readonly studentRepository: StudentRepositoryPort) {}

  async execute(studentData: CreateStudentDto): Promise<Student> {
    const newStudent = await this.studentRepository.createStudent(studentData);
    return newStudent;
  }
}
