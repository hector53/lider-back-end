import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FEE_EXTRA_ {
  @Field()
  type: string;
  @Field()
  value: number;
}

@ObjectType()
export class ProcessorsSiteDomain {
  @Field()
  _id: string;

  @Field()
  site_id: string;

  @Field()
  domain_id: string;

  @Field()
  processor_domain_id: string;

  @Field()
  processor_id: string;

  @Field()
  fee_extra: FEE_EXTRA_;

  @Field()
  custom_fee: number;

  @Field()
  hosted: boolean;

  @Field()
  processor_name: string;

  @Field()
  processor_identy: string;

  @Field()
  processor_image: string;

  @Field()
  processor_fee: number;

  @Field()
  active: boolean;
}
