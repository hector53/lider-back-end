import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class User {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  fullName: string;
}
