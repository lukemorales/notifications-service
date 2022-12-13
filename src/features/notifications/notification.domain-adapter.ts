import type { Notification as NotificationPersistor } from '@prisma/client';

import type { NotificationInput } from './notification.entity';
import { Notification } from './notification.entity';

export const notificationToDomain = (notification: NotificationPersistor) =>
  Notification.parse({
    id: notification.id,
    category: notification.category,
    content: notification.content,
    receiverId: notification.receiver_id,
    readAt: notification.read_at,
    createdAt: notification.created_at,
  } satisfies NotificationInput);
