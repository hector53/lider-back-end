import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class FEE_EXTRA_INPUT {
  @Field()
  type: string;
  @Field()
  value: number;
}

@InputType()
export class CreateProcessorsSiteDomainInput {
  @Field()
  site_id: string;

  @Field()
  domain_id: string;

  @Field()
  processor_domain_id: string;

  @Field()
  processor_id: string;

  @Field()
  identy: string;

  @Field()
  fee_extra: FEE_EXTRA_INPUT;

  @Field()
  custom_fee: number;

  @Field()
  hosted: boolean;
}
