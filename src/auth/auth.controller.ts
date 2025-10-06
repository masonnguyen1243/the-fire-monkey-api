import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/decorators/customize';
import { LoginDto, RegisterUserDto, verifyEmailDto } from './dto/auth.dto';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() registerUserDto: RegisterUserDto, @Res() res) {
    try {
      const result = await this.authService.register(registerUserDto);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify-email')
  @Public()
  async verifyEmail(@Body() verifyEmailDto: verifyEmailDto) {
    try {
      return await this.authService.verifyEmail(verifyEmailDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto, @Res() res) {
    try {
      const result = await this.authService.login(loginDto);

      res.cookie('accessToken', result?.accessToken, {
        // maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        maxAge: ms('1d'),
        httpOnly: true,
        sameSite: 'strict',
      });

      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
