import { ObjectType, Field } from '@nestjs/graphql';
import {
  detailsCryptoEntity,
  detailsWireEntity,
} from 'src/wallet/entities/wallet.entity';
@ObjectType()
export class walletWithdrawE {
  @Field()
  type: number;

  @Field()
  wallet: string;

  @Field()
  detailsWire: detailsWireEntity;

  @Field()
  detailsCrypto: detailsCryptoEntity;

  @Field()
  typeEwallet: string;
}
@ObjectType()
export class Withdraw {
  @Field()
  _id: string;
  @Field()
  site: string;

  @Field()
  currency: string;

  @Field()
  wallet: walletWithdrawE;

  @Field()
  amount: number;

  @Field()
  status: number;

  @Field()
  user_id: string;

  @Field()
  txid: string;

  @Field()
  created: Date;
}
