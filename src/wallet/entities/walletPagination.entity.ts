import { ObjectType, Field } from '@nestjs/graphql';
import { WalletsAdmin } from './wallet.entity';

@ObjectType()
export class WalletPagination {
  @Field(() => [WalletsAdmin])
  wallets: WalletsAdmin[];

  @Field()
  count: number;

  @Field()
  totalPages: number;

  @Field({ nullable: true })
  hasNextPage: boolean;

  @Field({ nullable: true })
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  nextPage: number;

  @Field({ nullable: true })
  previousPage: number;
}
