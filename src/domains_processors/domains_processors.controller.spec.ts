import { Test, TestingModule } from '@nestjs/testing';
import { DomainsProcessorsController } from './domains_processors.controller';
import { DomainsProcessorsService } from './domains_processors.service';

describe('DomainsProcessorsController', () => {
  let controller: DomainsProcessorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainsProcessorsController],
      providers: [DomainsProcessorsService],
    }).compile();

    controller = module.get<DomainsProcessorsController>(DomainsProcessorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
