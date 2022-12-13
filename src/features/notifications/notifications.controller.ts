import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';

import { A, O } from 'shared/fp-ts';
import { pipe } from 'fp-ts/function';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { notificationTransformer } from './notification.transformer';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() body: unknown) {
    const createNotificationDto = pipe(body, CreateNotificationDto.safeParse);

    if (!createNotificationDto.success) {
      // eslint-disable-next-line no-console
      console.log(createNotificationDto.error.flatten());

      throw new BadRequestException(
        'Validation error',
        createNotificationDto.error.errors
          .map((err) => JSON.stringify(err, null, 2))
          .join(', '),
      );
    }

    const notification = await this.notificationsService.create(
      createNotificationDto.data,
    );

    return pipe(notification, notificationTransformer);
  }

  @Get()
  async findAll() {
    const notifications = await this.notificationsService.findAll();

    return pipe(notifications, A.map(notificationTransformer));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const notification = await this.notificationsService.findOne(id);

    return pipe(notification, O.map(notificationTransformer), O.toUndefined);
  }

  @Patch(':id')
  async update(@Param('id') id: string) {
    const updatedNotification = await this.notificationsService.update(id);

    return pipe(updatedNotification, notificationTransformer);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
