import { z } from 'zod';

import {
  NotificationCategory,
  NotificationContent,
  ReceiverId,
} from '../notification.entity';

export const CreateNotificationDto = z.object({
  content: NotificationContent,
  category: NotificationCategory,
  receiverId: ReceiverId,
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationDto>;
