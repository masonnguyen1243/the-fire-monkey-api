import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  HttpException,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';
import { CloudinaryService } from '@/common/services/cloudinary.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  getProfile(@Req() req) {
    try {
      return req.user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Req() req,
    @Res() res,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const userId = req.user.id;

      // Nếu có file avatar được upload, upload lên Cloudinary
      if (file) {
        const avatarUrl = await this.cloudinaryService.uploadAvatar(file);
        updateUserDto.avatar = avatarUrl;
      }

      const user = await this.usersService.updateProfile(userId, updateUserDto);
      return res.status(200).json(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
