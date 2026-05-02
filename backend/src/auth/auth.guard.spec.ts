import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let jwtService: { verifyAsync: jest.Mock };
  let authGuard: AuthGuard;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    authGuard = new AuthGuard(jwtService as unknown as JwtService);
  });

  // prueba para verificar que se permite la peticion y se agrega el usuario cuando el token es valido
  it('permite la peticion y agrega el usuario cuando el token es valido', async () => {
    // verifica que se permite la peticion y se agrega el usuario cuando el token es valido
    const payload = { sub: 'admin' };
    const { context, request } = createContext('Bearer valid-token');
    jwtService.verifyAsync.mockResolvedValue(payload);

    await expect(authGuard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(request.user).toEqual(payload);
  });

  // prueba para verificar que se rechaza la peticion cuando no hay token
  it('rechaza la peticion cuando no hay token', async () => {
    // verifica que se rechaza la peticion cuando no hay token
    const { context } = createContext();

    await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  // prueba para verificar que se rechaza la peticion cuando el token no es valido
  it('rechaza la peticion cuando el token no es valido', async () => {
    // verifica que se rechaza la peticion cuando el token no es valido
    const { context } = createContext('Bearer invalid-token');
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    await expect(authGuard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});

// funcion para crear el contexto de la peticion
function createContext(authorization?: string) {
  // crea el request
  const request: {
    headers: { authorization?: string };
    user?: unknown;
  } = {
    headers: authorization ? { authorization } : {},
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  return { context, request };
}
