import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Template {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  type: string;

  @Field()
  active: boolean;
}
