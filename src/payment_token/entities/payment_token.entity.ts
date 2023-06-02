import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class dataPaymentToken {
  @Field({ nullable: true })
  invoice: string;

  @Field({ nullable: true })
  payment_url: string;

  @Field({ nullable: true })
  amount: number;

  @Field({ nullable: true })
  currency: string;

  @Field({ nullable: true })
  key: string;
}

@ObjectType()
export class PaymentToken {
  @Field()
  status: number;

  @Field()
  message: string;

  @Field(() => dataPaymentToken)
  data: dataPaymentToken;
}
