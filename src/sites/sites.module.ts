import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesResolver } from './sites.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './schema/sites.schema';
import {
  ProcessorsSiteDomainCLass,
  ProcessorsSiteDomainSchema,
} from 'src/processors-site-domain/schema/processors-site-domain.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Site.name,
        schema: SiteSchema,
      },
      {
        name: ProcessorsSiteDomainCLass.name,
        schema: ProcessorsSiteDomainSchema,
      },
    ]),
  ],
  providers: [SitesResolver, SitesService],
})
export class SitesModule {}
