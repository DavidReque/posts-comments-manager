// modulo para manejar la autenticacion
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInSeconds = Number(
          configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '3600',
        );

        return {
          secret: configService.get<string>('JWT_SECRET') ?? 'dev-jwt-secret',
          signOptions: {
            expiresIn:
              Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
                ? expiresInSeconds
                : 3600,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
