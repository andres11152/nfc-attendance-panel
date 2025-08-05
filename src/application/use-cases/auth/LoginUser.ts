import {
  CredentialsDto,
  AuthenticatedUser,
  AuthRepositoryPort,
} from '../../../core/domain/auth';

/**
 * Caso de uso de login: autentica y devuelve el usuario.
 * La persistencia del token se delega al repositorio concreto.
 */
export class LoginUser {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async execute(credentials: CredentialsDto): Promise<AuthenticatedUser> {
    const user = await this.authRepository.login(credentials);

    // Validación mínima
    if (!user.token || typeof user.token !== 'string') {
      throw new Error('Respuesta inválida del login: no se recibió token.'); 
    }

    return user;
  }
}
