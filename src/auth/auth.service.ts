import { PrismaService } from '@/prisma.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto, RegisterUserDto, verifyEmailDto } from './dto/auth.dto';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    if (!name || !email || !password) {
      throw new BadGatewayException('Missing required fields');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadGatewayException('User with this email already exists');
    }

    const hashedPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verityToken: codeId,
      },
    });

    if (!user) {
      throw new BadRequestException('User registration failed');
    }

    //Send email verification
    this.mailerService.sendMail({
      to: user.email as string,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: user?.name ?? user?.email,
        activationCode: codeId,
      },
    });

    return { user, success: true, message: 'User registered successfully' };
  }

  async verifyEmail(verifyEmailDto: verifyEmailDto) {
    const { email, code } = verifyEmailDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.verityToken !== code) {
      throw new BadRequestException('Invalid verification code');
    }
    if (user.isActive) {
      throw new BadRequestException('User already verified');
    }

    await this.prisma.user.update({
      where: { email },
      data: { isActive: true, verityToken: null },
    });

    return { success: true, message: 'Email verified successfully' };
  }

  async login(LoginDto: LoginDto) {
    const { email, password } = LoginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new BadRequestException('Please verify your email first');
    }

    const isPasswordValid = await comparePasswordHelper(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken = this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });

    const { password: _, ...rest } = user;

    return {
      success: true,
      message: 'Logged in successfully',
      user: rest,
      accessToken,
    };
  }
}
