import { Module } from '@nestjs/common';
import { PaymentTokenService } from './payment_token.service';
import { PaymentTokenController } from './payment_token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentToken,
  PaymentTokenSchema,
} from './schema/payment-token.schema';
import { Domain } from 'domain';
import { DomainSchema } from 'src/domains/schema/domains.schema';
import { Site, SiteSchema } from 'src/sites/schema/sites.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: PaymentToken.name,
        schema: PaymentTokenSchema,
      },
      {
        name: Domain.name,
        schema: DomainSchema,
      },
      {
        name: Site.name,
        schema: SiteSchema,
      },
    ]),
  ],
  controllers: [PaymentTokenController],
  providers: [PaymentTokenService],
})
export class PaymentTokenModule {}
