import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesResolver } from './templates.resolver';
import { TemplatesService } from './templates.service';

describe('TemplatesResolver', () => {
  let resolver: TemplatesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesResolver, TemplatesService],
    }).compile();

    resolver = module.get<TemplatesResolver>(TemplatesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
