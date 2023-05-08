import { InputType, Field } from '@nestjs/graphql';
import { type } from 'os';

@InputType()
export class CreateSiteInput {
  @Field()
  site: string;

  @Field()
  webhook: string;

  @Field({ nullable: true })
  public_key?: string;

  @Field({ nullable: true })
  private_key?: string;
}
