import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SitesService } from './sites.service';
import { Site } from './entities/site.entity';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { SitePagination } from './entities/sitePaginacion.entity';
import { UpdateSiteActiveInput } from './dto/update-site-active.input';

@Resolver(() => Site)
export class SitesResolver {
  constructor(private readonly sitesService: SitesService) {}

  @Mutation(() => Site)
  createSite(@Args('createSiteInput') createSiteInput: CreateSiteInput) {
    return this.sitesService.create(createSiteInput);
  }

  @Mutation(() => Site)
  updateSite(@Args('updateSiteInput') updateSiteInput: UpdateSiteInput) {
    return this.sitesService.update(updateSiteInput);
  }

  @Mutation(() => Site)
  updateSiteActive(
    @Args('updateSiteActive') activeInput: UpdateSiteActiveInput,
  ) {
    return this.sitesService.updateSiteActive(activeInput);
  }

  @Query(() => SitePagination, { name: 'sites' })
  findAll(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('search') search: string,
  ) {
    console.log('probando query');
    return this.sitesService.findAll(page, limit, search);
  }

  @Query(() => Site, { name: 'site' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sitesService.findOne(id);
  }

  @Mutation(() => Site)
  removeSite(@Args('id') id: string) {
    return this.sitesService.remove(id);
  }
}
