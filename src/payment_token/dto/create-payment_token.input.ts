import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePaymentTokenInput {
  @Field()
  invoice: string;

  @Field()
  amount: number;

  @Field()
  currency: string;

  @Field()
  key: string;
}
