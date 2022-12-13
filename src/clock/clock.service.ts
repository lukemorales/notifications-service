import { Injectable } from '@nestjs/common';

@Injectable()
export class ClockService {
  get now(): Date {
    return new Date();
  }
}
