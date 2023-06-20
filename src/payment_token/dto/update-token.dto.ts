import { IsNotEmpty } from 'class-validator';
export class UpdateTokenDto {
  @IsNotEmpty()
  token_domain: string;

  @IsNotEmpty()
  lider_token_id: string;

  @IsNotEmpty()
  identy: string;

  @IsNotEmpty()
  fee_extra: number;

  @IsNotEmpty()
  net_amount: number;

  @IsNotEmpty()
  custom_fee: number;

  @IsNotEmpty()
  amount_conversion: number;

  @IsNotEmpty()
  receipt_url: string;
}
