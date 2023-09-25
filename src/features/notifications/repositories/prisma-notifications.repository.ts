import { Injectable } from '@nestjs/common';

import { A, O, pipe } from 'funkcia';
import { PrismaService } from 'nestjs-prisma';
import { ulid } from 'ulid';

import type { RecipientId } from '@features/recipients/recipient.entity';
import { unprefixId } from '@shared/unprefix-id';

import {
  NotificationAdapter,
  NotificationCategoryAdapter,
} from '../notification.adapter';
import type { Notification, NotificationId } from '../notification.entity';
import type {
  CreateNotificationOptions,
  NotificationsRepository,
  UpdateNotificationsOptions,
} from './notifications.repository';
import { mergeUpdateNotificationOptions } from './notifications.repository';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  private readonly repository: PrismaService['notification'];

  constructor(prisma: PrismaService) {
    this.repository = prisma.notification;
  }

  async create(options: CreateNotificationOptions): Promise<Notification> {
    const { category, content, recipientId } = options;

    const notification = await this.repository.create({
      data: {
        id: ulid(),
        content,
        category: pipe(category, NotificationCategoryAdapter.fromDomain),
        recipient_id: recipientId,
      },
    });

    return pipe(notification, NotificationAdapter.toDomain);
  }

  async update(
    id: NotificationId,
    options: Partial<UpdateNotificationsOptions> = {},
  ): Promise<Notification> {
    const updates = mergeUpdateNotificationOptions(options);

    const notification = await this.repository.update({
      where: { id: unprefixId(id) },
      data: {
        content: updates.content.pipe(O.toUndefined),
        category: updates.category.pipe(
          O.map(NotificationCategoryAdapter.fromDomain),
          O.toUndefined,
        ),
        read_at: updates.readAt.pipe(O.toUndefined),
        canceled_at: updates.canceledAt.pipe(O.toUndefined),
      },
    });

    return pipe(notification, NotificationAdapter.toDomain);
  }

  async findById(id: NotificationId): Promise<O.Option<Notification>> {
    const notification = await this.repository.findUnique({
      where: {
        id: unprefixId(id),
      },
    });

    return O.fromNullable(notification).pipe(
      O.map(NotificationAdapter.toDomain),
    );
  }

  async findManyByRecipientId(
    recipientId: RecipientId,
  ): Promise<readonly Notification[]> {
    const notifications = await this.repository.findMany({
      where: {
        recipient_id: recipientId,
      },
    });

    return pipe(notifications, A.map(NotificationAdapter.toDomain));
  }

  async countAllByRecipientId(recipientId: RecipientId): Promise<number> {
    const count = await this.repository.count({
      where: {
        recipient_id: recipientId,
      },
    });

    return count;
  }
}
