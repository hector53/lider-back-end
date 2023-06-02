import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentToken,
  PaymentTokenSchema,
} from 'src/payment_token/schema/payment-token.schema';
import { User, UserSchema } from 'src/users/schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentToken.name,
        schema: PaymentTokenSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [DashboardResolver, DashboardService],
})
export class DashboardModule {}
