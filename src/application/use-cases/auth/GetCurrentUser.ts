import { AuthRepositoryPort, AuthenticatedUser } from '../../../core/domain/auth';

/**
 * Caso de uso para obtener el usuario autenticado actual.
 */
export class GetCurrentUser {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async execute(): Promise<AuthenticatedUser | undefined> {
    return await this.authRepository.getCurrentUser();
  }
}
