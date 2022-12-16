import { Injectable } from '@nestjs/common';

import { pipe } from 'fp-ts/function';

import { ClockService } from '@features/clock/clock.service';
import { O } from '@shared/fp-ts';

import type { CreateNotificationDto } from './dtos/create-notification.dto';
import { NotificationsRepository } from './repositories/notifications.repository';
import type { NotificationId, ReceiverId } from './notification.entity';

type DispatchNotificationOptions = CreateNotificationDto;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly clock: ClockService,
    private readonly repository: NotificationsRepository,
  ) {}

  async countAllByReceiverId(receiverId: ReceiverId) {
    const count = await this.repository.countAllByReceiverId(receiverId);

    return count;
  }

  async dispatch(options: DispatchNotificationOptions) {
    const { category, content, receiverId } = options;

    const notification = await this.repository.create({
      content,
      category,
      receiverId,
    });

    return notification;
  }

  async findAllByReceiverId(receiverId: ReceiverId) {
    const notifications = await this.repository.findManyByReceiverId(
      receiverId,
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
