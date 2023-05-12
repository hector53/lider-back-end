import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsController } from './domains.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Domain, DomainSchema } from './schema/domains.schema';
import { DomainsResolver } from './domains.resolver';
import {
  DomainProcessors,
  DomainProcessorsSchema,
} from 'src/domains_processors/schema/domains_processors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Domain.name,
        schema: DomainSchema,
      },
      {
        name: DomainProcessors.name,
        schema: DomainProcessorsSchema,
      },
    ]),
  ],
  controllers: [DomainsController],
  providers: [DomainsResolver, DomainsService],
})
export class DomainsModule {}
