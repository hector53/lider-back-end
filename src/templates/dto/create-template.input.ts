import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTemplateInput {
  @Field()
  name: string;

  @Field()
  html: string;

  @Field()
  type: number;
}
