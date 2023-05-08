import { Test, TestingModule } from '@nestjs/testing';
import { ProcessorsSiteDomainResolver } from './processors-site-domain.resolver';
import { ProcessorsSiteDomainService } from './processors-site-domain.service';

describe('ProcessorsSiteDomainResolver', () => {
  let resolver: ProcessorsSiteDomainResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessorsSiteDomainResolver, ProcessorsSiteDomainService],
    }).compile();

    resolver = module.get<ProcessorsSiteDomainResolver>(ProcessorsSiteDomainResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
