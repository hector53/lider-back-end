import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PaymentsInput {
  @Field()
  exampleField: number;
}
