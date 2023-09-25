import { O } from 'funkcia';

import type { RecipientId } from '@features/recipients/recipient.entity';
import { createDefaultEntityUpdateOptions } from '@shared/create-default-entity-update-options';
import type { Optional } from '@shared/fp-ts/option';

import type { CreateNotificationDto } from '../dtos/create-notification.dto';
import type {
  Notification,
  NotificationId,
  NotificationSchema,
} from '../notification.entity';

export type CreateNotificationOptions = CreateNotificationDto;

export type UpdateNotificationsOptions = Optional<
  Omit<
    NotificationSchema,
    'id' | 'recipientId' | 'createdAt' | 'readAt' | 'canceledAt'
  > & {
    readAt: Date | null;
    canceledAt: Date | null;
  }
>;

export const mergeUpdateNotificationOptions =
  createDefaultEntityUpdateOptions<UpdateNotificationsOptions>({
    category: O.none(),
    content: O.none(),
    readAt: O.none(),
    canceledAt: O.none(),
  });

export abstract class NotificationsRepository {
  abstract create(options: CreateNotificationOptions): Promise<Notification>;

  abstract update(
    id: NotificationId,
    options: Partial<UpdateNotificationsOptions>,
  ): Promise<Notification>;

  abstract findById(id: NotificationId): Promise<O.Option<Notification>>;

  abstract findManyByRecipientId(
    receiverId: RecipientId,
  ): Promise<readonly Notification[]>;

  abstract countAllByRecipientId(receiverId: RecipientId): Promise<number>;
}
