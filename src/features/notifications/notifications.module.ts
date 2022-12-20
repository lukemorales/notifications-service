import { Module } from '@nestjs/common';

import { ClockModule } from '@features/clock/clock.module';

import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './repositories/notifications.repository';
import { PrismaNotificationsRepository } from './repositories/prisma-notifications.repository';

@Module({
  imports: [ClockModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
})
export class NotificationsModule {}
