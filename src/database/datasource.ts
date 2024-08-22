import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'postgres',
  port: process.env.DB_PORT as unknown as number,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: true,
    requestCert: true,
    ca: process.env.DB_CA,
  },
};

export const dataSource = new DataSource(dataSourceOptions);
