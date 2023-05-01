import { Test, TestingModule } from '@nestjs/testing';
import { ProcessorsController } from './processors.controller';
import { ProcessorsService } from './processors.service';

describe('ProcessorsController', () => {
  let controller: ProcessorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessorsController],
      providers: [ProcessorsService],
    }).compile();

    controller = module.get<ProcessorsController>(ProcessorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
