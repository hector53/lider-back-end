import { Test, TestingModule } from '@nestjs/testing';
import { DomainsProcessorsService } from './domains_processors.service';

describe('DomainsProcessorsService', () => {
  let service: DomainsProcessorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainsProcessorsService],
    }).compile();

    service = module.get<DomainsProcessorsService>(DomainsProcessorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
