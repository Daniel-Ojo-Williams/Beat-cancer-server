import { Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

const JWT_PROVIDER = (
  provide: string,
  secretName: string,
  expiresIn: JwtSignOptions['expiresIn'],
): Provider => ({
  provide,
  useFactory: (config: ConfigService) => {
    const secret = config.get<string>(secretName);
    return new JwtService({
      secret,
      signOptions: { expiresIn },
    });
  },
  inject: [ConfigService],
});

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    JWT_PROVIDER('JWT_ACCESS', 'JWT_SECRET', '5h'),
    JWT_PROVIDER('JWT_REFRESH', 'JWT_REFRESH', '7d'),
    AuthService,
  ],
})
export class AuthModule {}
