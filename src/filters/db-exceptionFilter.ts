import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DbExceptionFilter implements ExceptionFilter {
  constructor(private readonly handlerName: string) {}
  catch(exception: DatabaseError, host: ArgumentsHost) {
    const handlerName = this.handlerName;
    const resp = host.switchToHttp().getResponse<Response>();

    const errorCode = exception.code;

    switch (errorCode) {
      case '23505':
        if (handlerName === 'register')
          resp
            .status(HttpStatus.CONFLICT)
            .json({ message: 'Account with email already exists' });
    }
  }
}
