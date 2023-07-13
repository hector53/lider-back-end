import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ArgsType,
  Field,
} from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardPagination } from './entities/payments_dashboard.entity';
import {
  DailySales,
  MonthlySales,
  TotalSales,
} from './entities/daily_sales.entity';
import { Type } from 'class-transformer';

@ArgsType()
class TotalSalesArgs {
  @Field() // Este campo es el id
  id: string;

  @Field(() => [Date]) // Este campo es el array de fechas
  @Type(() => Date) // Este decorador le indica a class-transformer que cada elemento del array debe ser tratado como un string
  date: Date[];

  @Field() // Este campo es el id
  rangeActive: boolean;
}

@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardPagination, { name: 'paymentsByAdmin' })
  findPaymentsByAdmin(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
    @Args('user_id') user_id: string,
  ) {
    return this.dashboardService.findPaymentsByAdmin(
      page,
      limit,
      search,
      user_id,
    );
  }

  @Query(() => DailySales, { name: 'dailySales' })
  dailySales(@Args('id') id: string) {
    return this.dashboardService.dailySales(id);
  }

  @Query(() => MonthlySales, { name: 'MonthlySales' })
  MonthlySales(@Args('id') id: string) {
    return this.dashboardService.monthlySales(id);
  }

  @Query(() => TotalSales, { name: 'TotalSales' })
  TotalSales(@Args() args: TotalSalesArgs) {
    const { id, date, rangeActive } = args;
    return this.dashboardService.totalSales(id, date, rangeActive);
  }
}
