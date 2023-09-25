import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { A, R, O, pipe } from 'funkcia';

import { RecipientId } from '@features/recipients/recipient.entity';
import { throwBadRequestOnParseError, zodDecode } from '@shared/validation';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { NotificationAdapter } from './notification.adapter';
import { NotificationId } from './notification.entity';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const notificationId = pipe(id, this.parseNotificationId);

    const notification = await this.notificationsService.findOne(
      notificationId,
    );

    return notification.pipe(O.map(NotificationAdapter.toJSON), O.toUndefined);
  }

  @Get('from/:receiverId')
  async findManyByReceiverId(@Param('receiverId') id: string) {
    const receiverId = pipe(id, this.parseReceiverId);

    const receiverNotifications =
      await this.notificationsService.findAllByRecipientId(receiverId);

    return pipe(receiverNotifications, A.map(NotificationAdapter.toJSON));
  }

  @Get('from/:receiverId/count')
  async countAllByReceiverId(@Param('receiverId') id: string) {
    const receiverId = pipe(id, this.parseReceiverId);

    const notificationsCount =
      await this.notificationsService.countAllByRecipientId(receiverId);

    return { count: notificationsCount };
  }

  @Post()
  async create(@Body() payload: unknown) {
    const createNotificationDto = pipe(
      payload,
      zodDecode(CreateNotificationDto),
      throwBadRequestOnParseError,
    );

    const notification = await this.notificationsService.dispatch(
      createNotificationDto,
    );

    return pipe(notification, NotificationAdapter.toJSON);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    const notificationId = pipe(id, this.parseNotificationId);

    const updatedNotification = await this.notificationsService.markAsRead(
      notificationId,
    );

    return pipe(updatedNotification, NotificationAdapter.toJSON);
  }

  @Patch(':id/unread')
  async markAsUnread(@Param('id') id: string) {
    const notificationId = pipe(id, this.parseNotificationId);

    const updatedNotification = await this.notificationsService.markAsUnread(
      notificationId,
    );

    return pipe(updatedNotification, NotificationAdapter.toJSON);
  }

  @Patch(':id/invalidate')
  async remove(@Param('id') id: string) {
    const notificationId = pipe(id, this.parseNotificationId);

    return this.notificationsService.invalidate(notificationId);
  }

  private parseNotificationId(id: string) {
    return pipe(
      id,
      zodDecode(NotificationId),
      R.expect(() => new NotFoundException(`Notification not found: ${id}`)),
    );
  }

  private parseReceiverId(id: string) {
    return pipe(
      id,
      zodDecode(RecipientId),
      R.expect(() => new NotFoundException(`Receiver not found: ${id}`)),
    );
  }
}
