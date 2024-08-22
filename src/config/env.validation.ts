import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_TYPE: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;
}

// --| The nestjs/config module injects the env variables into this function
export function validateEnvVariables(env: Record<string, unknown>) {
  // --| Convert variables injected to an instance of the EnvVariables class
  const validatedEnv = plainToInstance(EnvVariables, env, {
    enableImplicitConversion: true,
  });

  // --| Validate the instance of EnvVariable class generated, get errors if any of the properties is missing
  const errors = validateSync(validatedEnv, {
    skipMissingProperties: false,
  });

  // --| If any error while validating the env variables, throw the error, preventing the app from bootstrapping
  if (errors.length > 0) throw new Error(errors.toString());

  // --| Return the validated env variables, to be served by ConfigModule
  return validatedEnv;
}
