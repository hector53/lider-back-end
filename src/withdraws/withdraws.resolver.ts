import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { WithdrawsService } from './withdraws.service';
import { Withdraw } from './entities/withdraw.entity';
import { CreateWithdrawInput } from './dto/create-withdraw.input';
import { UpdateWithdrawInput } from './dto/update-withdraw.input';
import { WithdrawPaginationUser } from './entities/withdrawPaginationUser.entity';

@Resolver(() => Withdraw)
export class WithdrawsResolver {
  constructor(private readonly withdrawsService: WithdrawsService) {}

  @Mutation(() => Withdraw)
  createWithdraw(
    @Args('createWithdrawInput') createWithdrawInput: CreateWithdrawInput,
  ) {
    return this.withdrawsService.create(createWithdrawInput);
  }

  @Query(() => WithdrawPaginationUser, { name: 'allWithdraws' })
  findAll(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
  ) {
    return this.withdrawsService.findAll(page, limit, search);
  }

  @Query(() => Withdraw, { name: 'withdraw' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.withdrawsService.findOne(id);
  }

  @Query(() => Float, { name: 'availableByUser' })
  availableByUser(@Args('id') id: string) {
    return this.withdrawsService.availableByUser(id);
  }

  @Mutation(() => Withdraw)
  updateWithdraw(
    @Args('updateWithdrawInput') updateWithdrawInput: UpdateWithdrawInput,
  ) {
    return this.withdrawsService.update(
      updateWithdrawInput.id,
      updateWithdrawInput,
    );
  }

  @Mutation(() => Withdraw, { name: 'updateStatusWithdraw' })
  updateStatusWithdraw(
    @Args('id') id: string,
    @Args('status') status: number,
    @Args('txid') txid: string,
  ) {
    return this.withdrawsService.updateStatusWithdraw(id, status, txid);
  }

  @Mutation(() => Withdraw)
  removeWithdraw(@Args('id', { type: () => Int }) id: number) {
    return this.withdrawsService.remove(id);
  }

  @Query(() => WithdrawPaginationUser, { name: 'withdrawsByUser' })
  withdrawsByUser(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
    @Args('userId') userId: string,
  ) {
    return this.withdrawsService.withdrawsByUser(page, limit, search, userId);
  }
}
