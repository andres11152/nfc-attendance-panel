// src/infrastructure/http/AttendanceRepositoryHttp.ts

import {
  AttendanceRepositoryPort,
  AttendanceRecord,
  AttendanceRegisterDto,
  AttendanceFilters,
} from '../../core/domain/attendance';
import {
  LocalStorageTokenStorage,
  getAuthHeader,
} from '../../application/use-cases/auth/tokenStorage';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export class AttendanceRepositoryHttp implements AttendanceRepositoryPort {
  private tokenStorage = new LocalStorageTokenStorage();

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...getAuthHeader(this.tokenStorage),
      ...(extra || {}),
    };
  }

  async getAttendanceHistory(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(`${API_BASE}/attendance/history${query}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error obteniendo historial de asistencia: ${res.status} ${text}`);
    }

    return res.json();
  }

          async recordAttendance(data: { nfcId: string }): Promise<AttendanceRecord> {
        const res = await fetch(`${API_BASE}/attendance`, {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error registrando asistencia: ${res.status} ${text}`);
        }

        return res.json();
      }



  async getAttendanceRecordById(id: string): Promise<AttendanceRecord | undefined> {
    const res = await fetch(`${API_BASE}/attendance/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });

    if (res.status === 404) return undefined;
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error obteniendo registro de asistencia: ${res.status} ${text}`);
    }

    return res.json();
  }
}
