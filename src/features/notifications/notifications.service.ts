import { Injectable } from '@nestjs/common';

import { pipe } from 'fp-ts/function';

import { ClockService } from '@features/clock/clock.service';
import { O } from '@shared/fp-ts';
import type { RecipientId } from '@features/recipients/recipient.entity';

import type { CreateNotificationDto } from './dtos/create-notification.dto';
import { NotificationsRepository } from './repositories/notifications.repository';
import type { NotificationId } from './notification.entity';

type DispatchNotificationOptions = CreateNotificationDto;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly clock: ClockService,
    private readonly repository: NotificationsRepository,
  ) {}

  async countAllByRecipientId(recipientId: RecipientId) {
    const count = await this.repository.countAllByRecipientId(recipientId);

    return count;
  }

  async dispatch(options: DispatchNotificationOptions) {
    const { category, content, recipientId } = options;

    const notification = await this.repository.create({
      content,
      category,
      recipientId,
    });

    return notification;
  }

  async findAllByRecipientId(recipientId: RecipientId) {
    const notifications = await this.repository.findManyByRecipientId(
      recipientId,
    );

    return notifications;
  }

  async findOne(id: NotificationId) {
    const notification = await this.repository.findById(id);

    return notification;
  }

  async invalidate(id: NotificationId) {
    await this.repository.update(id, {
      canceledAt: pipe(this.clock.now, O.some),
    });
  }

  async markAsRead(id: NotificationId) {
    const updatedNotification = await this.repository.update(id, {
      readAt: pipe(this.clock.now, O.some),
    });

    return updatedNotification;
  }

  async markAsUnread(id: NotificationId) {
    const updatedNotification = await this.repository.update(id, {
      readAt: pipe(null, O.some),
    });

    return updatedNotification;
  }
}
