import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawsResolver } from './withdraws.resolver';
import { WithdrawsService } from './withdraws.service';

describe('WithdrawsResolver', () => {
  let resolver: WithdrawsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawsResolver, WithdrawsService],
    }).compile();

    resolver = module.get<WithdrawsResolver>(WithdrawsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
