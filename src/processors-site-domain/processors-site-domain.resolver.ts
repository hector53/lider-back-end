import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProcessorsSiteDomainService } from './processors-site-domain.service';
import { ProcessorsSiteDomain } from './entities/processors-site-domain.entity';
import { CreateProcessorsSiteDomainInput } from './dto/create-processors-site-domain.input';
import { UpdateProcessorsSiteDomainInput } from './dto/update-processors-site-domain.input';

@Resolver(() => ProcessorsSiteDomain)
export class ProcessorsSiteDomainResolver {
  constructor(
    private readonly processorsSiteDomainService: ProcessorsSiteDomainService,
  ) {}

  @Mutation(() => ProcessorsSiteDomain)
  createProcessorsSiteDomain(
    @Args('createProcessorsSiteDomainInput')
    createProcessorsSiteDomainInput: CreateProcessorsSiteDomainInput,
  ) {
    return this.processorsSiteDomainService.create(
      createProcessorsSiteDomainInput,
    );
  }

  @Query(() => [ProcessorsSiteDomain], { name: 'processorsSiteDomain' })
  findAll() {
    return this.processorsSiteDomainService.findAll();
  }

  @Query(() => [ProcessorsSiteDomain], { name: 'get_processors_site_domain' })
  findAllProcessorsSiteDomain(
    @Args('domain_id') domain_id: string,
    @Args('site_id') site_id: string,
  ) {
    return this.processorsSiteDomainService.findAllProcessorsSiteDomain(
      domain_id,
      site_id,
    );
  }

  @Query(() => ProcessorsSiteDomain, { name: 'processorsSiteDomain' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.processorsSiteDomainService.findOne(id);
  }

  @Mutation(() => ProcessorsSiteDomain)
  removeProcessorsSiteDomain(@Args('id', { type: () => Int }) id: number) {
    return this.processorsSiteDomainService.remove(id);
  }
}
