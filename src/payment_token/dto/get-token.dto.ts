import { IsNotEmpty } from 'class-validator';
export class GetTokenDto {
  @IsNotEmpty()
  token_domain: string;

  @IsNotEmpty()
  token_url: string;
}
