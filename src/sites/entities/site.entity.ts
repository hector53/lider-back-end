import { ObjectType, Field } from '@nestjs/graphql';
import { ProcessorsSiteDomain } from 'src/processors-site-domain/entities/processors-site-domain.entity';

@ObjectType()
export class Site {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  site: string;

  @Field({ nullable: true })
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

  @Field(() => [ProcessorsSiteDomain]) //
  processorsSites: ProcessorsSiteDomain[];

  @Field()
  active: boolean;

  @Field()
  created?: Date;

  @Field({ nullable: true })
  public_key?: string;

  @Field({ nullable: true })
  private_key?: string;
}
