import { IsNotEmpty } from 'class-validator';
export class GetProcessorDto {
  @IsNotEmpty()
  identy: string;

  @IsNotEmpty()
  public_key: string;
}
