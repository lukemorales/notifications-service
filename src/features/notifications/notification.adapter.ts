import type { Notification as NotificationModel } from '@prisma/client';
import { pipe } from 'fp-ts/function';

import { O } from '@shared/fp-ts';
import type { SerializableEntity } from '@shared/serializable-entity';

import type { NotificationInput } from './notification.entity';
import { Notification } from './notification.entity';

export class NotificationAdapter {
  static toDomain(model: NotificationModel) {
    const modelToDomain = {
      id: model.id,
      category: model.category,
      content: model.content,
      receiverId: model.receiver_id,
      readAt: model.read_at,
      canceledAt: model.canceled_at,
      createdAt: model.created_at,
    } satisfies NotificationInput;

    return Notification.parse(modelToDomain);
  }

  static toJSON(domain: Notification): SerializableEntity<Notification> {
    return {
      id: domain.id,
      content: domain.content,
      category: domain.category,
      receiverId: domain.receiverId,
      readAt: pipe(domain.readAt, O.toNullable),
      canceledAt: pipe(domain.canceledAt, O.toNullable),
      createdAt: domain.createdAt,
    };
  }
}
