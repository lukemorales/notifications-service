import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ClockService } from './clock.service';

describe('ClockService', () => {
  let service: ClockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockService],
    }).compile();

    service = module.get<ClockService>(ClockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
