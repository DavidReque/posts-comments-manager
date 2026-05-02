// guard para manejar la autenticacion
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // metodo para verificar si el usuario esta autenticado
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token JWT requerido');
    }

    try {
      // verifica el token
      const payload = await this.jwtService.verifyAsync(token);
      // agrega el payload al request
      (request as Request & { user: unknown }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token JWT invalido o expirado');
    }
  }

  // metodo para extraer el token del header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
