import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTokenController } from './payment_token.controller';
import { PaymentTokenService } from './payment_token.service';

describe('PaymentTokenController', () => {
  let controller: PaymentTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentTokenController],
      providers: [PaymentTokenService],
    }).compile();

    controller = module.get<PaymentTokenController>(PaymentTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
