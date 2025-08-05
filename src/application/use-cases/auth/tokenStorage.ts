export class LocalStorageTokenStorage {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }
}

export function getAuthHeader(tokenStorage: LocalStorageTokenStorage): Record<string, string> {
  const token = tokenStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
