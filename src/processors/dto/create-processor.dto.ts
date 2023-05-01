import { IsNotEmpty } from 'class-validator';
export class CreateProcessorDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  fee: string;

  image?: string;
}
