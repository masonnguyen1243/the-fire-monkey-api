import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserRoleByAdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();

    return { message: 'Users fetched successfully', users };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return { message: 'User fetched successfully', user };
  }

  async updateUserRoleByAdmin(
    id: string,
    updateUserRoleByAdminDto: UpdateUserRoleByAdminDto,
  ) {
    const { role } = updateUserRoleByAdminDto;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return { message: 'Updated user successfully!', data: updatedUser };
  }

  async deleteUserByAdmin(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully!' };
  }
}
