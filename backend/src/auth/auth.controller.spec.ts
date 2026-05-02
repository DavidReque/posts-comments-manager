import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('envuelve la respuesta de login en ApiResponse.success', async () => {
    const loginResponse = {
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresIn: '3600s',
    };
    const authService = {
      login: jest.fn().mockResolvedValue(loginResponse),
    };
    const controller = new AuthController(
      authService as unknown as AuthService,
    );
    const loginDto = { username: 'admin', password: 'secret' };

    await expect(controller.login(loginDto)).resolves.toEqual({
      success: true,
      message: 'Autenticacion exitosa',
      data: loginResponse,
    });
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });
});
