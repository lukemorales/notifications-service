import { Module } from '@nestjs/common';

import { PrismaModule } from 'nestjs-prisma';

import { ClockModule } from './features/clock/clock.module';
import { NotificationsModule } from './features/notifications/notifications.module';

@Module({
  imports: [
    ClockModule,
    NotificationsModule,
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
