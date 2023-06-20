import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class processorPayment {
  @Field()
  name: string;

  @Field()
  identy: string;

  @Field()
  image: string;
}

@ObjectType()
export class assignedUserPayment {
  @Field()
  _id: string;
  @Field()
  fullName: string;
  @Field()
  email: string;
}

@ObjectType()
export class PaymentsDashboard {
  @Field()
  invoice: string;

  @Field()
  amount: number;

  @Field()
  currency: string;

  @Field(() => [assignedUserPayment])
  assigned_user: assignedUserPayment[];

  @Field(() => [processorPayment])
  processor: processorPayment[];

  @Field()
  receipt_url: string;

  @Field()
  fee: number;

  @Field()
  fee_extra: number;

  @Field()
  net_amount: number;

  @Field()
  amount_conversion: number;

  @Field()
  created: Date;
}

@ObjectType()
export class DashboardPagination {
  @Field(() => [PaymentsDashboard])
  payments: PaymentsDashboard[];

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
