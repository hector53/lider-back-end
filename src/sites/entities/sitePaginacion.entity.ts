import { ObjectType, Field } from '@nestjs/graphql';
import { Site } from './site.entity';
@ObjectType()
export class SitePagination {
  @Field(() => [Site])
  sites: Site[];

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
