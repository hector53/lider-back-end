import { IsNotEmpty } from 'class-validator';
export class CreatePaymentTokenDto {
  @IsNotEmpty()
  invoice: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  key: string;

  template: number;
}
