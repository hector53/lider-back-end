import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTokenService } from './payment_token.service';

describe('PaymentTokenService', () => {
  let service: PaymentTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentTokenService],
    }).compile();

    service = module.get<PaymentTokenService>(PaymentTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
