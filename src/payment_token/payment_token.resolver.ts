import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentToken } from './entities/payment_token.entity';
import { PaymentTokenService } from './payment_token.service';
import { CreatePaymentTokenInput } from './dto/create-payment_token.input';

@Resolver(() => PaymentToken)
export class PaymentTokenResolver {
  constructor(private readonly paymentTokenService: PaymentTokenService) {}

  @Mutation(() => PaymentToken, { name: 'createPaymentToken' })
  createPaymentToken(
    @Args('inputs') paymentTokenInput: CreatePaymentTokenInput,
  ) {
    return this.paymentTokenService.create(paymentTokenInput);
  }
}
