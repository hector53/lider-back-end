import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class Languaje {
  @Field()
  titleHeader: string;

  @Field()
  titleOrder: string;

  @Field()
  payWithCard: string;

  @Field()
  footerTitle: string;

  @Field()
  feeExtra: string;
}
