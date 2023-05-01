import { PartialType } from '@nestjs/swagger';
import { CreateDomainsProcessorDto } from './create-domains_processor.dto';

export class UpdateDomainsProcessorDto extends PartialType(CreateDomainsProcessorDto) {}
