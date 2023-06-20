import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateWalletActiveInput {
  @Field({ nullable: true })
  _id?: string;

  @Field()
  active: boolean;
}
