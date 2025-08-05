// src/core/domain/student.ts

// Entidad
export interface Student {
  id: string;
  name: string;
  lastName: string;
  nfcId: string;
  createdAt?: string;
}

// DTOs
export interface CreateStudentDto {
  name: string;
  lastName: string;
  nfcId: string;
}

export interface UpdateStudentDto {
  name?: string;
  lastName?: string;
  nfcId?: string;
}

// Puerto de repositorio que usa el FRONT
export interface StudentRepositoryPort {
  getStudents(): Promise<Student[]>;
  getStudentById(id: string): Promise<Student | undefined>;
  findByNfcId(nfcId: string): Promise<Student | undefined>;
  createStudent(data: CreateStudentDto): Promise<Student>;
  updateStudent(id: string, data: UpdateStudentDto): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
}
