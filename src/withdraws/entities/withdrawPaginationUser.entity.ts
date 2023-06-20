import { ObjectType, Field } from '@nestjs/graphql';
import { Withdraw } from './withdraw.entity';

@ObjectType()
export class WithdrawPaginationUser {
  @Field(() => [Withdraw])
  withdraws: Withdraw[];

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
