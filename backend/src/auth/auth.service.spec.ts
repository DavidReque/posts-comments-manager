import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: { get: jest.Mock };
  let jwtService: { signAsync: jest.Mock };
  // beforeEach para inicializar los servicios
  beforeEach(() => {
    configService = { // mock para el servicio de configuracion
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          AUTH_USERNAME: 'admin',
          AUTH_PASSWORD: 'secret',
          JWT_EXPIRES_IN_SECONDS: '900',
        };

        return values[key];
      }),
    };
    jwtService = { // mock para el servicio de jwt
      signAsync: jest.fn().mockResolvedValue('jwt-token'),
    };

    authService = new AuthService(
      configService as unknown as ConfigService,
      jwtService as unknown as JwtService,
    );
  });

  it('retorna un token cuando las credenciales son validas', async () => { // prueba para verificar que se retorna un token cuando las credenciales son validas
    const result = await authService.login({
      username: 'admin',
      password: 'secret',
    });

    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 'admin' });
    // verifica que el resultado sea el esperado
    expect(result).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresIn: '900s',
    });
  });

  // prueba para verificar que se rechazan las credenciales invalidas
  it('rechaza credenciales invalidas', async () => {
    // verifica que se rechazan las credenciales invalidas
    await expect(
      authService.login({ username: 'admin', password: 'bad-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
