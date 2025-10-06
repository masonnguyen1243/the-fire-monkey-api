import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserRoleByAdminDto } from './dto/admin.dto';
import { AdminRoleGuard } from '@/auth/passport/admin-role.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(AdminRoleGuard)
  findAll() {
    try {
      return this.adminService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(AdminRoleGuard)
  findOne(@Param('id') id: string) {
    try {
      return this.adminService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseGuards(AdminRoleGuard)
  async updateUserRoleByAdmin(
    @Param('id') id: string,
    @Body() updateUserRoleByAdminDto: UpdateUserRoleByAdminDto,
  ) {
    try {
      const result = await this.adminService.updateUserRoleByAdmin(
        id,
        updateUserRoleByAdminDto,
      );

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(AdminRoleGuard)
  async deleteUserByAdmin(@Param('id') id: string) {
    try {
      return await this.adminService.deleteUserByAdmin(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
