// --- Importar Puertos e Implementaciones (Adaptadores) ---
import { StudentRepositoryPort } from '../../core/domain/student';
import { AttendanceRepositoryPort } from '../../core/domain/attendance';
import { AuthRepositoryPort } from '../../core/domain/auth';

// Repositorios reales / de integración
import { AuthRepositoryHttp } from '../../infrastructure/http/AuthRepositoryHttp';
import { StudentRepositoryHttp } from '../../infrastructure/http/StudentRepositoryHttp';
import { AttendanceRepositoryHttp } from '../../infrastructure/http/AttendanceRepositoryHttp';

// --- Importar Casos de Uso ---
import { CreateStudent } from '../use-cases/student/CreateStudent';
import { GetStudents } from '../use-cases/student/GetStudents';
import { UpdateStudent } from '../use-cases/student/UpdateStudent';
import { DeleteStudent } from '../use-cases/student/DeleteStudent';
import { FindStudentByNfcId } from '../use-cases/student/FindStudentByNfcId';

import { RecordAttendance } from '../use-cases/attendance/RecordAttendance';
import { RecordAttendanceByNfcId } from '../use-cases/attendance/RecordAttendanceByNfcId';
import { GetAttendanceHistory } from '../use-cases/attendance/GetAttendanceHistory';

import { LoginUser } from '../use-cases/auth/LoginUser';
import { GetCurrentUser } from '../use-cases/auth/GetCurrentUser';
import { LogoutUser } from '../use-cases/auth/LogoutUser';

// --- Instanciar Repositorios (Adaptadores) ---
const studentRepository: StudentRepositoryPort = new StudentRepositoryHttp();
const attendanceRepository: AttendanceRepositoryPort = new AttendanceRepositoryHttp();
const authRepository: AuthRepositoryPort = new AuthRepositoryHttp();

// --- Instanciar Casos de Uso e Inyectar Dependencias ---
export const createStudentUseCase = new CreateStudent(studentRepository);
export const getStudentsUseCase = new GetStudents(studentRepository);
export const updateStudentUseCase = new UpdateStudent(studentRepository);
export const deleteStudentUseCase = new DeleteStudent(studentRepository);
export const findStudentByNfcIdUseCase = new FindStudentByNfcId(studentRepository);

export const recordAttendanceUseCase = new RecordAttendance(attendanceRepository, studentRepository);
export const recordAttendanceByNfcIdUseCase = new RecordAttendanceByNfcId(attendanceRepository, studentRepository); // 🆕

export const getAttendanceHistoryUseCase = new GetAttendanceHistory(attendanceRepository);

export const loginUserUseCase = new LoginUser(authRepository);
export const getCurrentUserUseCase = new GetCurrentUser(authRepository);
export const logoutUserUseCase = new LogoutUser(authRepository);

// Actualizar el objeto 'useCases'
export const useCases = {
  student: {
    create: createStudentUseCase,
    get: getStudentsUseCase,
    update: updateStudentUseCase,
    delete: deleteStudentUseCase,
    findByNfcId: findStudentByNfcIdUseCase,
  },
  attendance: {
    record: recordAttendanceUseCase,
    recordViaNfcId: recordAttendanceByNfcIdUseCase, // 🆕 nuevo método expuesto
    history: getAttendanceHistoryUseCase,
  },
  auth: {
    login: loginUserUseCase,
    getCurrentUser: getCurrentUserUseCase,
    logout: logoutUserUseCase,
  },
};
