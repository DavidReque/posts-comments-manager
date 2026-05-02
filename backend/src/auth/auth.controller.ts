import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '../common/utils/api-response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // metodo para iniciar sesion
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return ApiResponse.success(data, 'Autenticacion exitosa');
  }
}
