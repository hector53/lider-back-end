import { InputType, Field } from '@nestjs/graphql';
import { detailsCrypto, detailsWire } from 'src/wallet/dto/create-wallet.input';

@InputType()
export class walletWithdraw {
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
}

@InputType()
export class CreateWithdrawInput {
  @Field()
  site: string;

  @Field()
  currency: string;

  @Field()
  wallet: walletWithdraw;

  @Field()
  amount: number;

  @Field()
  user_id: string;
}
