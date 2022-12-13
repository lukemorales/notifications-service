import { ulidSchema } from 'shared/zod';
import { z } from 'zod';

import { NotificationContent } from '../notification.entity';

export const CreateNotificationDto = z.object({
  content: NotificationContent,
  category: z.string().min(1),
  recipientId: ulidSchema(),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationDto>;
