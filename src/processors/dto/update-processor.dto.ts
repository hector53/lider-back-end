import { PartialType } from '@nestjs/swagger';
import { CreateProcessorDto } from './create-processor.dto';

export class UpdateProcessorDto extends PartialType(CreateProcessorDto) {}
