import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login-user.dto';
import { Public } from 'src/guards/auth.guard';
import { DbExceptionFilter } from 'src/filters/db-exceptionFilter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(new DbExceptionFilter('register'))
  @Public()
  @Post('signup')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(createUserDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh-token',
    });

    return {
      user,
      accessToken,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh-token',
    });

    return {
      user,
      accessToken,
    };
  }

  @Public()
  @Get('refresh-token')
  async guard(
    @Req() req: Request,
    @Query('reload', new ValidationPipe({ transform: true })) reload?: boolean,
  ) {
    const cookies = req.cookies;
    const refreshToken: string = cookies['refreshToken'];
    return this.authService.refresh(refreshToken, reload);
  }
}
