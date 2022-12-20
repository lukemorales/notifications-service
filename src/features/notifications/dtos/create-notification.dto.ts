import { z } from 'zod';

import { RecipientId } from '@features/recipients/recipient.entity';

import {
  NotificationCategory,
  NotificationContent,
} from '../notification.entity';

export const CreateNotificationDto = z.object({
  content: NotificationContent,
  category: NotificationCategory,
  recipientId: RecipientId,
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationDto>;
