import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSiteActiveInput {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  active: boolean;
}
