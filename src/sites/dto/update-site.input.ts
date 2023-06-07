import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FEE_EXTRA_2 {
  @Field()
  type: string;
  @Field()
  value: number;
}

@InputType()
export class ProcessorsSiteDomain2 {
  @Field()
  _id: string;

  @Field()
  site_id: string;

  @Field()
  fee_extra: FEE_EXTRA_2;

  @Field()
  custom_fee: number;

  @Field()
  hosted: boolean;

  @Field()
  active: boolean;
}

@InputType()
export class UpdateSiteInput {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  site: string;

  @Field()
  nameStore: string;

  @Field({ nullable: true })
  amounts?: string;

  @Field({ nullable: true })
  fee_quantity: boolean;

  @Field()
  webhook: string;

  @Field({ nullable: true })
  assigned_domain?: string;

  @Field({ nullable: true })
  assigned_user?: string;

  @Field({ nullable: true })
  template_individual?: string;

  @Field({ nullable: true })
  template_multiple?: string;

  @Field({ nullable: true })
  language?: string;

  @Field({ nullable: true })
  success_url?: string;

  @Field(() => [String]) // especifica que currency es un array de string
  currency: string[];

  @Field(() => [ProcessorsSiteDomain2]) //
  processorsSites: ProcessorsSiteDomain2[];

  @Field()
  active: boolean;
}
