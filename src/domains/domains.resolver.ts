import { Resolver, Query } from '@nestjs/graphql';
import { Domain } from './entities/domain.entity';
import { DomainsService } from './domains.service';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuardHql } from 'src/auth/jwt-guardhql.guard';

@UseGuards(JWTAuthGuardHql)
@Resolver(() => Domain)
export class DomainsResolver {
  constructor(private readonly domainService: DomainsService) {}
  @Query(() => [Domain], { name: 'domains' })
  findAll() {
    return this.domainService.allDomains();
  }
}
