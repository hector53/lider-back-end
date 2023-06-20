import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardPagination } from './entities/payments_dashboard.entity';
import {
  DailySales,
  MonthlySales,
  TotalSales,
} from './entities/daily_sales.entity';

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
  TotalSales(@Args('id') id: string) {
    return this.dashboardService.totalSales(id);
  }
}
