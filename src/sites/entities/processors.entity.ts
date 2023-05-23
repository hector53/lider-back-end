import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class Processor {
  @Field()
  _id: string;

  @Field()
  image: string;

  @Field()
  name: string;

  @Field()
  identy: string;

  @Field()
  fee: string;
}
