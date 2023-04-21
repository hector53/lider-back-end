import { IsNotEmpty, IsStrongPassword } from 'class-validator';
export class UpdatePasswordDto {
  @IsNotEmpty()
  current_password: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  new_password: string;
}
