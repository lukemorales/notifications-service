import { Module } from '@nestjs/common';

import { PrismaModule } from 'nestjs-prisma';

import { ClockModule } from './features/clock/clock.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { HealthModule } from './features/health/health.module';

@Module({
  imports: [
    ClockModule,
    HealthModule,
    NotificationsModule,
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
