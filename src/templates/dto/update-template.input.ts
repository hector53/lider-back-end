import { CreateTemplateInput } from './create-template.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTemplateInput {
  @Field()
  id: string;

  @Field()
  html: string;
}
