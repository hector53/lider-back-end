import { CreateWithdrawInput } from './create-withdraw.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWithdrawInput extends PartialType(CreateWithdrawInput) {
  @Field(() => Int)
  id: number;
}
