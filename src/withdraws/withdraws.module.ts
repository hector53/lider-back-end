import { Module } from '@nestjs/common';
import { WithdrawsService } from './withdraws.service';
import { WithdrawsResolver } from './withdraws.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdraw, WithdrawSchema } from './schema/withdraws.schema';
import { Site, SiteSchema } from 'src/sites/schema/sites.schema';
import {
  PaymentToken,
  PaymentTokenSchema,
} from 'src/payment_token/schema/payment-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Withdraw.name,
        schema: WithdrawSchema,
      },
      {
        name: Site.name,
        schema: SiteSchema,
      },
      {
        name: PaymentToken.name,
        schema: PaymentTokenSchema,
      },
    ]),
  ],
  providers: [WithdrawsResolver, WithdrawsService],
})
export class WithdrawsModule {}
