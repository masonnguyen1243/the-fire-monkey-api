import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'john doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '12345678a' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class verifyEmailDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString()
  code: string;
}

export class LoginDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '12345678a' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
