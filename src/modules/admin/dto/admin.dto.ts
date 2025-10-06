import { IsEnum, IsString } from 'class-validator';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UpdateUserRoleByAdminDto {
  @IsEnum(Role)
  role: Role;
}
