import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/decorators/customize';
import { RegisterUserDto, verifyEmailDto } from './dto/auth.dto';
import { Param } from 'generated/prisma/runtime/library';

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
}
