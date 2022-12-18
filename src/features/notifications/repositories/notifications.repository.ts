import { O } from '@shared/fp-ts';

import type { CreateNotificationDto } from '../dtos/create-notification.dto';
import type {
  Notification,
  NotificationId,
  NotificationSchema,
  ReceiverId,
} from '../notification.entity';

export type CreateNotificationOptions = CreateNotificationDto;

export type UpdateNotificationsOptions = O.Optional<
  Omit<
    NotificationSchema,
    'id' | 'receiverId' | 'createdAt' | 'readAt' | 'canceledAt'
  > & {
    readAt: Date | null;
    canceledAt: Date | null;
  }
>;

export const UPDATE_NOTIFICATION_OPTIONS: UpdateNotificationsOptions = {
  category: O.none,
  content: O.none,
  readAt: O.none,
  canceledAt: O.none,
};

export abstract class NotificationsRepository {
  abstract create(options: CreateNotificationOptions): Promise<Notification>;

  abstract update(
    id: NotificationId,
    options: Partial<UpdateNotificationsOptions>,
  ): Promise<Notification>;

  abstract findById(id: NotificationId): Promise<O.Option<Notification>>;

  abstract findManyByReceiverId(
    receiverId: ReceiverId,
  ): Promise<readonly Notification[]>;

  abstract countAllByReceiverId(receiverId: ReceiverId): Promise<number>;
}
