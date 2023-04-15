import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { UserRole } from '../schema/users.schema';
export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 2,
  })
  password: string;
}
