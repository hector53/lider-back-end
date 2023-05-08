import { CreateProcessorsSiteDomainInput } from './create-processors-site-domain.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProcessorsSiteDomainInput extends PartialType(
  CreateProcessorsSiteDomainInput,
) {}
