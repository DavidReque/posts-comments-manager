// servicio para manejar la autenticacion
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // metodo para iniciar sesion
  async login(loginDto: LoginDto) {
    const expectedUsername =
      this.configService.get<string>('AUTH_USERNAME') ?? 'admin';
    const expectedPassword =
      this.configService.get<string>('AUTH_PASSWORD') ?? 'admin123';

    // valida las credenciales
    if (
      loginDto.username !== expectedUsername ||
      loginDto.password !== expectedPassword
    ) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    // crea el payload para el token
    const payload = { sub: loginDto.username };
    // crea el token
    const accessToken = await this.jwtService.signAsync(payload);
    const expiresInSeconds = Number(
      this.configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '3600',
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn:
        Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
          ? `${expiresInSeconds}s`
          : '3600s',
    };
  }
}
