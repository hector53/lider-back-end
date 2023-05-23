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
import { Template } from 'src/templates/entities/template.entity';
import { TemplateSchema } from 'src/templates/schema/templates.schema';
import {
  ProcessorsSiteDomainCLass,
  ProcessorsSiteDomainSchema,
} from 'src/processors-site-domain/schema/processors-site-domain.schema';
import {
  Processor,
  ProcessorSchema,
} from 'src/processors/schema/processors.schema';

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
      ,
      {
        name: Template.name,
        schema: TemplateSchema,
      },
      {
        name: ProcessorsSiteDomainCLass.name,
        schema: ProcessorsSiteDomainSchema,
      },
      {
        name: Processor.name,
        schema: ProcessorSchema,
      },
    ]),
  ],
  controllers: [PaymentTokenController],
  providers: [PaymentTokenService],
})
export class PaymentTokenModule {}
