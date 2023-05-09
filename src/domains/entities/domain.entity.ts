import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class Domain {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  active: boolean;
}
