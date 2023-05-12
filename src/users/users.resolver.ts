import { Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuardHql } from 'src/auth/jwt-guardhql.guard';

@UseGuards(JWTAuthGuardHql)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  @Query(() => [User], { name: 'usersSites' })
  findAll() {
    return this.userService.allUsersForSites();
  }
}
