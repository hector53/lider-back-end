import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class detailsCrypto {
  @Field()
  currency: string;

  @Field()
  red: string;
}

@InputType()
export class detailsWire {
  @Field()
  payee_name: string;

  @Field()
  type_payee: string;

  @Field()
  address: string;

  @Field()
  apt_or_suite: string;

  @Field()
  bank_name: string;

  @Field()
  routing_number: string;
}

@InputType()
export class CreateWalletInput {
  @Field()
  type: number;

  @Field()
  wallet: string;

  @Field()
  detailsWire: detailsWire;

  @Field()
  detailsCrypto: detailsCrypto;

  @Field()
  typeEwallet: string;

  @Field()
  user_id: string;
}
