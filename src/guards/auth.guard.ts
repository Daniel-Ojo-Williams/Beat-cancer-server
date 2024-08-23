import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/Types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('JWT_ACCESS') private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = this.extractToken(req);

    if (token) throw new UnauthorizedException({ message: 'Token not found' });

    try {
      const user = await this.jwt.verifyAsync<AuthPayload>(token);

      req['user'] = user;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException({ message: 'Token Expired' });
    }
    return true;
  }

  extractToken(req: Request) {
    const [Bearer, token] = req.headers['authorization'].split(' ') || [];

    return Bearer === 'Bearer' ? token : undefined;
  }
}

const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
