import { IsNotEmpty } from 'class-validator';
export class GetProcessorDto {
  @IsNotEmpty()
  token_domain: string;

  @IsNotEmpty()
  token_url: string;

  @IsNotEmpty()
  identy: string;

  @IsNotEmpty()
  id_processor: string;
}
