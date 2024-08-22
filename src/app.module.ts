import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { validateEnvVariables } from './config/env.validation';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVariables,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
  ],
})
export class AppModule {}
