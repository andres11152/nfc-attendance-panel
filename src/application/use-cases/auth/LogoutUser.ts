// src/application/use-cases/auth/LogoutUser.ts

import { AuthRepositoryPort } from '../../../core/domain/auth';
import { LocalStorageTokenStorage } from './tokenStorage';

export class LogoutUser {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly tokenStorage = new LocalStorageTokenStorage()
  ) {}

  /**
   * Ejecuta el logout en backend (si aplica) y limpia el token local.
   */
  async execute(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (e) {
      // Si falla el logout remoto, igual se limpia el token local para evitar sesión inválida.
      console.warn('Error durante logout remoto, se limpia igual el token local.', e);
    }
    this.tokenStorage.removeToken();
  }
}
