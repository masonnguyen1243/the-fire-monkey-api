import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma.module';
import { CloudinaryService } from '@/common/services/cloudinary.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
})
export class UsersModule {}
