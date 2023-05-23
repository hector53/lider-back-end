import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Template {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  html: string;

  @Field()
  type: number;
}
@ObjectType()
export class TemplatePagination {
  @Field(() => [Template])
  templates: Template[];

  @Field()
  count: number;

  @Field()
  totalPages: number;

  @Field({ nullable: true })
  hasNextPage: boolean;

  @Field({ nullable: true })
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  nextPage: number;

  @Field({ nullable: true })
  previousPage: number;
}
