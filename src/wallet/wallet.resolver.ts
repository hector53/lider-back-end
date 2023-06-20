import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { WalletPagination } from './entities/walletPagination.entity';
import { UpdateWalletActiveInput } from './dto/update-wallet-active.input';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => Wallet)
  createWallet(
    @Args('createWalletInput') createWalletInput: CreateWalletInput,
  ) {
    return this.walletService.create(createWalletInput);
  }

  @Mutation(() => Wallet)
  updateWalletActive(
    @Args('updateWalletActive') activeInput: UpdateWalletActiveInput,
  ) {
    return this.walletService.updateWalletActive(activeInput);
  }

  @Query(() => WalletPagination, { name: 'wallets' })
  findAll(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
  ) {
    return this.walletService.findAll(page, limit, search);
  }

  @Query(() => Wallet, { name: 'wallet' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.walletService.findOne(id);
  }

  @Query(() => Wallet, { name: 'getWalletUser' })
  getWalletUser(@Args('user_id') id: string) {
    return this.walletService.getWalletUser(id);
  }

  @Mutation(() => Wallet)
  updateWallet(
    @Args('updateWalletInput') updateWalletInput: UpdateWalletInput,
  ) {
    return this.walletService.update(updateWalletInput.id, updateWalletInput);
  }

  @Mutation(() => Wallet)
  updateWalletUser(
    @Args('updateWalletInput') updateWalletInput: UpdateWalletInput,
  ) {
    return this.walletService.updateWallerUser(
      updateWalletInput.id,
      updateWalletInput,
    );
  }

  @Mutation(() => Wallet)
  removeWallet(@Args('id') id: string) {
    return this.walletService.remove(id);
  }
}
