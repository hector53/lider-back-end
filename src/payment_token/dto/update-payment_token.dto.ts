import { PartialType } from '@nestjs/swagger';
import { CreatePaymentTokenDto } from './create-payment_token.dto';

export class UpdatePaymentTokenDto extends PartialType(CreatePaymentTokenDto) {}
