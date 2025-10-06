import { PrismaService } from '@/prisma.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserDto } from './dto/auth.dto';
import { hashPasswordHelper } from '@/helpers/utils';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console';

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

  create(createAuthDto: any) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
