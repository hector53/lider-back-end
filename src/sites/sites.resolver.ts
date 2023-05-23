import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SitesService } from './sites.service';
import { Site } from './entities/site.entity';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { SitePagination } from './entities/sitePaginacion.entity';
import { UpdateSiteActiveInput } from './dto/update-site-active.input';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuardHql } from 'src/auth/jwt-guardhql.guard';
import { JWTAuthGuardHqlUser } from 'src/auth/jwt-guardhqlUser';
import { Languaje } from './entities/languaje.entity';
import { Processor } from './entities/processors.entity';

@Resolver(() => Site)
export class SitesResolver {
  constructor(private readonly sitesService: SitesService) {}

  @Mutation(() => Site)
  @UseGuards(JWTAuthGuardHql)
  createSite(@Args('createSiteInput') createSiteInput: CreateSiteInput) {
    return this.sitesService.create(createSiteInput);
  }

  @Mutation(() => Site)
  @UseGuards(JWTAuthGuardHql)
  updateSite(@Args('updateSiteInput') updateSiteInput: UpdateSiteInput) {
    return this.sitesService.update(updateSiteInput);
  }

  @Mutation(() => Site, { name: 'updateSiteWebhook' })
  @UseGuards(JWTAuthGuardHql)
  updateSiteWebhook(
    @Args('site_id') site_id: string,
    @Args('webhook') webhook: string,
  ) {
    return this.sitesService.updateSiteWebhook(site_id, webhook);
  }

  @Mutation(() => Site)
  @UseGuards(JWTAuthGuardHql)
  updateSiteActive(
    @Args('updateSiteActive') activeInput: UpdateSiteActiveInput,
  ) {
    return this.sitesService.updateSiteActive(activeInput);
  }

  @Query(() => SitePagination, { name: 'sites' })
  @UseGuards(JWTAuthGuardHql)
  findAll(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
  ) {
    console.log('probando query');
    return this.sitesService.findAll(page, limit, search);
  }

  @Query(() => Languaje, { name: 'languajes' })
  getlanguaje(@Args('lang') lang: string) {
    console.log('probando query');
    return this.sitesService.getLanguaje(lang);
  }

  @Query(() => [Processor], { name: 'processorsTemplate' })
  getProcessors() {
    return this.sitesService.getProcessors();
  }

  @Query(() => Site, { name: 'site' })
  @UseGuards(JWTAuthGuardHql)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sitesService.findOne(id);
  }

  @UseGuards(JWTAuthGuardHqlUser)
  @Query(() => Site, { name: 'getSiteByUserId' })
  getSiteByUserId(@Args('id') id: string) {
    return this.sitesService.getSiteByUserId(id);
  }

  @Mutation(() => Site)
  @UseGuards(JWTAuthGuardHql)
  removeSite(@Args('id') id: string) {
    return this.sitesService.remove(id);
  }

  @Query(() => Site, { name: 'languaje' })
  getLanguaje(@Args('lang') lang: string) {
    return this.sitesService.getLanguaje(lang);
  }
}
