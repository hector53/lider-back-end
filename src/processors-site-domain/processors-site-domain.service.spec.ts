import { Test, TestingModule } from '@nestjs/testing';
import { ProcessorsSiteDomainService } from './processors-site-domain.service';

describe('ProcessorsSiteDomainService', () => {
  let service: ProcessorsSiteDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessorsSiteDomainService],
    }).compile();

    service = module.get<ProcessorsSiteDomainService>(ProcessorsSiteDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
