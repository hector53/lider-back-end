import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesResolver } from './templates.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schema/templates.schema';
import { TemplatesController } from './templates.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Template.name,
        schema: TemplateSchema,
      },
    ]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesResolver, TemplatesService],
})
export class TemplatesModule {}
