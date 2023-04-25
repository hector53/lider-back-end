import { Module } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { DomainsController } from './domains.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Domain, DomainSchema } from './schema/domains.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Domain.name,
        schema: DomainSchema,
      },
    ]),
  ],
  controllers: [DomainsController],
  providers: [DomainsService],
})
export class DomainsModule {}
