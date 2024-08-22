import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './Types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject('JWT_ACCESS') private readonly jwt_access: JwtService,
    @Inject('JWT_REFRESH') private readonly jwt_refresh: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);

    const user = await this.usersService.findUserByEmail(createUserDto.email);
    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    return { user, accessToken, refreshToken };
  }

  async generateAccessToken(id: string, email: string) {
    const payload: AuthPayload = { sub: id, email };
    return await this.jwt_access.signAsync(payload);
  }

  async generateRefreshToken(id: string, email: string) {
    const payload: AuthPayload = { sub: id, email };
    return await this.jwt_refresh.signAsync(payload);
  }
}
