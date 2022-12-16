import { Injectable } from '@nestjs/common';

import { pipe } from 'fp-ts/function';
import { PrismaService } from 'nestjs-prisma';
import { ulid } from 'ulid';
import type { Option } from 'fp-ts/Option';

import { A, O } from '@shared/fp-ts';
import { unprefixId } from '@shared/unprefix-id';

import { NotificationAdapter } from '../notification.adapter';
import type {
  Notification,
  NotificationId,
  ReceiverId,
} from '../notification.entity';
import type {
  CreateNotificationOptions,
  NotificationsRepository,
  UpdateNotificationsOptions,
} from './notifications.repository';
import { UPDATE_NOTIFICATION_OPTIONS } from './notifications.repository';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  private readonly repository: PrismaService['notification'];

  constructor(private readonly prisma: PrismaService) {
    this.repository = this.prisma.notification;
  }

  async create(options: CreateNotificationOptions): Promise<Notification> {
    const { category, content, receiverId } = options;

    const notification = await this.repository.create({
      data: {
        id: ulid(),
        content,
        category,
        receiver_id: unprefixId(receiverId),
      },
    });

    return pipe(notification, NotificationAdapter.toDomain);
  }

  async update(
    id: NotificationId,
    options: Partial<UpdateNotificationsOptions> = {},
  ): Promise<Notification> {
    const values = {
      ...UPDATE_NOTIFICATION_OPTIONS,
      ...options,
    };

    const notification = await this.repository.update({
      where: { id: unprefixId(id) },
      data: {
        content: pipe(values.content, O.toUndefined),
        category: pipe(values.category, O.toUndefined),
        read_at: pipe(values.readAt, O.toUndefined),
        canceled_at: pipe(values.canceledAt, O.toUndefined),
      },
    });

    return pipe(notification, NotificationAdapter.toDomain);
  }

  async findById(id: NotificationId): Promise<Option<Notification>> {
    const notification = await this.repository.findUnique({
      where: {
        id: unprefixId(id),
      },
    });

    return pipe(notification, O.fromNullableMap(NotificationAdapter.toDomain));
  }

  async findManyByReceiverId(
    receiverId: ReceiverId,
  ): Promise<readonly Notification[]> {
    const notifications = await this.repository.findMany({
      where: {
        receiver_id: unprefixId(receiverId),
      },
    });

    return pipe(notifications, A.map(NotificationAdapter.toDomain));
  }

  async countAllByReceiverId(receiverId: ReceiverId): Promise<number> {
    const count = await this.repository.count({
      where: {
        receiver_id: unprefixId(receiverId),
      },
    });

    return count;
  }
}
