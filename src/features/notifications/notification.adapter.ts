/* eslint-disable max-classes-per-file */
import { pipe } from 'fp-ts/function';

import { O } from '@shared/fp-ts';
import type { SerializableEntity } from '@shared/serializable-entity';
import { exhaustive } from '@shared/exhaustive';

import { NotificationCategory } from './notification.entity';
import type { NotificationSchema } from './notification.entity';
import type { NotificationModel } from './notification.model';
import { NotificationModelCategory } from './notification.model';
import { Notification } from './notification.entity';

export class NotificationCategoryAdapter {
  static toDomain(raw: string) {
    const category = pipe(raw, NotificationModelCategory.parse);

    return exhaustive(category, {
      NEWS: () => NotificationCategory.enum.News,
      PROMO: () => NotificationCategory.enum.Promo,
      SOCIAL: () => NotificationCategory.enum.Social,
    });
  }

  static fromDomain(category: NotificationCategory) {
    return exhaustive(category, {
      News: () => NotificationModelCategory.enum.NEWS,
      Promo: () => NotificationModelCategory.enum.PROMO,
      Social: () => NotificationModelCategory.enum.SOCIAL,
    });
  }
}

export class NotificationAdapter {
  static toDomain(model: NotificationModel) {
    return new Notification({
      id: model.id,
      category: pipe(model.category, NotificationCategoryAdapter.toDomain),
      content: model.content,
      recipientId: model.recipient_id,
      readAt: model.read_at,
      canceledAt: model.canceled_at,
      createdAt: model.created_at,
    });
  }

  static toJSON(
    domain: NotificationSchema,
  ): SerializableEntity<NotificationSchema> {
    return {
      id: domain.id,
      content: domain.content,
      category: domain.category,
      recipientId: domain.recipientId,
      readAt: pipe(domain.readAt, O.toNullable),
      canceledAt: pipe(domain.canceledAt, O.toNullable),
      createdAt: domain.createdAt,
    };
  }
}
