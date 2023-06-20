import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class detailsCryptoEntity {
  @Field()
  currency: string;

  @Field()
  red: string;
}

@ObjectType()
export class detailsWireEntity {
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

@ObjectType()
export class Wallet {
  @Field({ nullable: true })
  _id?: string;

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

  @Field()
  created?: Date;
  @Field()
  active: boolean;
}

@ObjectType()
export class WalletsAdmin {
  @Field({ nullable: true })
  _id?: string;

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

  @Field()
  user: string;

  @Field({ nullable: true })
  site: string;

  @Field()
  created?: Date;
  @Field()
  active: boolean;
}
