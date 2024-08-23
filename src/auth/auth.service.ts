import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './Types';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
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

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email, true);

    if (!user)
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch)
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    delete user.password;

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

  async refresh(refreshToken: string, reload?: boolean) {
    try {
      const payload =
        await this.jwt_refresh.verifyAsync<AuthPayload>(refreshToken);
      const { email } = payload;
      const user = await this.usersService.findUserByEmail(email);
      const accessToken = await this.generateAccessToken(
        payload.sub,
        payload.email,
      );
      return !reload ? { accessToken } : { user, accessToken };
    } catch (error) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
