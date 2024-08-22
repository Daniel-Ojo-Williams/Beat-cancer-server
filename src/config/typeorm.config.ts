import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getConfigOptions(config: ConfigService): DataSourceOptions {
    const env = config.get<string>('NODE_ENV');
    return {
      type: config.get<'postgres'>('DB_TYPE'),
      port: config.get('DB_PORT'),
      host: config.get('DB_HOST'),
      username: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: false,
      ssl: {
        rejectUnauthorized: true,
        requestCert: true,
        ca: env === 'development' && config.get<string>('DB_CA'),
      },
    };
  }
}

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService): Promise<DataSourceOptions> =>
    TypeOrmConfig.getConfigOptions(config),
  inject: [ConfigService],
};
