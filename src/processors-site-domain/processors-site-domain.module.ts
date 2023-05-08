import { Module } from '@nestjs/common';
import { ProcessorsSiteDomainService } from './processors-site-domain.service';
import { ProcessorsSiteDomainResolver } from './processors-site-domain.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessorsSiteDomainCLass,
  ProcessorsSiteDomainSchema,
} from './schema/processors-site-domain.schema';
import { DomainsProcessorsService } from 'src/domains_processors/domains_processors.service';
import {
  DomainProcessors,
  DomainProcessorsSchema,
} from 'src/domains_processors/schema/domains_processors.schema';
import { Domain } from 'domain';
import { DomainSchema } from 'src/domains/schema/domains.schema';
import {
  Processor,
  ProcessorSchema,
} from 'src/processors/schema/processors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessorsSiteDomainCLass.name,
        schema: ProcessorsSiteDomainSchema,
      },
      {
        name: DomainProcessors.name,
        schema: DomainProcessorsSchema,
      },
      {
        name: Domain.name,
        schema: DomainSchema,
      },
      {
        name: Processor.name,
        schema: ProcessorSchema,
      },
    ]),
  ],
  providers: [
    ProcessorsSiteDomainResolver,
    ProcessorsSiteDomainService,
    DomainsProcessorsService,
  ],
})
export class ProcessorsSiteDomainModule {}
