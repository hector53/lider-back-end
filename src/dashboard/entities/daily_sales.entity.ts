import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DailySales {
  @Field()
  value: number;

  @Field()
  porcentaje: number;
}

@ObjectType()
export class MonthlySales {
  @Field()
  value: number;

  @Field()
  porcentaje: number;

  @Field()
  ordenes: number;

  @Field()
  ordenesPrevious: number;
  @Field()
  porcentajeOrdenes: number;
}

@ObjectType()
export class TotalSales {
  @Field()
  value: number;

  @Field()
  porcentaje: number;
}
