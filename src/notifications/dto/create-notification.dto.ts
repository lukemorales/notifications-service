import { ulidSchema } from 'shared/ulid-schema';
import { z } from 'zod';

export const CreateNotificationDto = z.object({
  content: z.string().min(5).max(240),
  category: z.string().min(1),
  recipientId: ulidSchema().optional(),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationDto>;
