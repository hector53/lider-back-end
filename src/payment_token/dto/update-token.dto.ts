import { IsNotEmpty } from 'class-validator';
export class UpdateTokenDto {
  @IsNotEmpty()
  token_domain: string;

  @IsNotEmpty()
  lider_token_id: string;

  @IsNotEmpty()
  identy: string;

  @IsNotEmpty()
  fee: number;

  @IsNotEmpty()
  net_amount: number;

  @IsNotEmpty()
  amount_conversion: number;

  @IsNotEmpty()
  receipt_url: string;
}
