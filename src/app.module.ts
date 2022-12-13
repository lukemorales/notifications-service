import { Module } from '@nestjs/common';

import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClockModule } from './clock/clock.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ClockModule,
    NotificationsModule,
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
