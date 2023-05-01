import { Module } from '@nestjs/common';
import { DomainsProcessorsService } from './domains_processors.service';
import { DomainsProcessorsController } from './domains_processors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DomainProcessors,
  DomainProcessorsSchema,
} from './schema/domains_processors.schema';
import { Domain, DomainSchema } from 'src/domains/schema/domains.schema';
import {
  Processor,
  ProcessorSchema,
} from 'src/processors/schema/processors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
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
  controllers: [DomainsProcessorsController],
  providers: [DomainsProcessorsService],
})
export class DomainsProcessorsModule {}
