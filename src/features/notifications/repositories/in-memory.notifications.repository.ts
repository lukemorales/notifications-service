import { Injectable } from '@nestjs/common';

import { pipe } from 'fp-ts/function';

import { O, A } from '@shared/fp-ts';

import type { Notification, NotificationId } from '../notification.entity';
import type {
  CreateNotificationOptions,
  NotificationsRepository,
  UpdateNotificationsOptions,
} from './notifications.repository';
import { UPDATE_NOTIFICATION_OPTIONS } from './notifications.repository';
import { makeNotification } from '../factories/notification.factory';

@Injectable()
export class InMemoryNotificationRepository implements NotificationsRepository {
  public items: Notification[] = [];

  async create({
    category,
    content,
    receiverId,
  }: CreateNotificationOptions): Promise<Notification> {
    const notification = makeNotification({ category, content, receiverId });

    this.items.push(notification);

    return notification;
  }

  async update(
    id: NotificationId,
    options: Partial<UpdateNotificationsOptions> = {},
  ): Promise<Notification> {
    const values = {
      ...UPDATE_NOTIFICATION_OPTIONS,
      ...options,
    };

    return pipe(
      this.items,
      A.findFirst((notification) => notification.id === id),
      O.map((draft) => {
        draft.content = pipe(
          values.content,
          O.getOrElse(() => draft.content),
        );

        draft.category = pipe(
          values.category,
          O.getOrElse(() => draft.category),
        );

        draft.readAt = pipe(
          values.readAt,
          O.combineK(() => draft.readAt),
          O.flatMap(O.fromNullable),
        );

        return draft;
      }),
      O.getOrElse(() => {
        throw new Error(`Notification not found: ${id}`);
      }),
    );
  }

  async findById(id: NotificationId): Promise<O.Option<Notification>> {
    return pipe(
      this.items,
      A.findFirst((notification) => notification.id === id),
    );
  }

  async findManyByReceiverId(
    receiverId: string,
  ): Promise<readonly Notification[]> {
    return pipe(
      this.items,
      A.filter((notification) => notification.receiverId === receiverId),
    );
  }

  async countAllByReceiverId(receiverId: string): Promise<number> {
    return pipe(
      this.items,
      A.filter((notification) => notification.receiverId === receiverId),
      A.size,
    );
  }
}
