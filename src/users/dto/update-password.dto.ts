import { IsStrongPassword } from 'class-validator';
export class UpdatePasswordDto {
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 2,
  })
  password: string;
}
