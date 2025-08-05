import {
  StudentRepositoryPort,
  Student,
  CreateStudentDto,
  UpdateStudentDto,
} from '../../core/domain/student';
import {
  LocalStorageTokenStorage,
  getAuthHeader,
} from '../../application/use-cases/auth/tokenStorage';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export class StudentRepositoryHttp implements StudentRepositoryPort {
  private tokenStorage = new LocalStorageTokenStorage();

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...getAuthHeader(this.tokenStorage),
      ...(extra || {}),
    };
  }

  async getStudents(): Promise<Student[]> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error obteniendo estudiantes: ${res.status} ${text}`);
    }

    return res.json();
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (res.status === 404) return undefined;
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error obteniendo estudiante: ${res.status} ${text}`);
    }

    return res.json();
  }

  async findByNfcId(nfcId: string): Promise<Student | undefined> {
    const res = await fetch(`${API_BASE}/students/nfc`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({ nfcId }),
    });

    if (res.status === 404) return undefined;
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error buscando por NFC ID: ${res.status} ${text}`);
    }

    return res.json();
  }

  async createStudent(data: CreateStudentDto): Promise<Student> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error creando estudiante: ${res.status} ${text}`);
    }

    return res.json();
  }

  async updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error actualizando estudiante: ${res.status} ${text}`);
    }

    return res.json();
  }

  async deleteStudent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: this.buildHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error eliminando estudiante: ${res.status} ${text}`);
    }
  }

   // ------ AJUSTE: IMPORTAR MASIVO DE EXCEL -------
  async importStudents(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    // Obtenemos SOLO el header de Authorization
    const headers: Record<string, string> = {
      ...getAuthHeader(this.tokenStorage)
      // NO pongas 'Content-Type' aquí
    };

    const res = await fetch(`${API_BASE}/students/import`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error importando estudiantes: ${res.status} ${text}`);
    }
  }

}
