import { IsNotEmpty } from 'class-validator';
export class UpdateTemplateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  html: string;
}
