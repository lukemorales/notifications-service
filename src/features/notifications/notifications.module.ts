import { Module } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
