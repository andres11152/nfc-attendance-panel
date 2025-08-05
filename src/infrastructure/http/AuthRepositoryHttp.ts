// src/infrastructure/http/AuthRepositoryHttp.ts
import {
  AuthRepositoryPort,
  CredentialsDto,
  AuthenticatedUser,
} from '../../core/domain/auth';
import {
  LocalStorageTokenStorage,
  getAuthHeader,
} from '../../application/use-cases/auth/tokenStorage';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export class AuthRepositoryHttp implements AuthRepositoryPort {
  private tokenStorage = new LocalStorageTokenStorage();

  private async request<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const token = this.tokenStorage.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(opts.headers as Record<string, string> | undefined),
    };

    const res = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Error HTTP ${res.status}: ${text}`);
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
  }

  async login(credentials: CredentialsDto): Promise<AuthenticatedUser> {
    const user = await this.request<AuthenticatedUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!user.token) {
      throw new Error('El login no devolvió token.');
    }

    this.tokenStorage.setToken(user.token);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(this.tokenStorage),
        },
      });
    } catch {
      // fallback silencioso si no hay endpoint de logout
    }
    this.tokenStorage.removeToken();
  }

  async getCurrentUser(): Promise<AuthenticatedUser | undefined> {
    try {
      const user = await this.request<AuthenticatedUser>('/auth/me');
      return user;
    } catch (err) {
      console.warn('⚠️ No se pudo obtener current user:', err);
      return undefined;
    }
  }
}
