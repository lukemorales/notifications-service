import { z } from 'zod';
import { brandedEntityId } from 'shared/branded-entity-id';
import { O } from 'shared/fp-ts';
import { ulidSchema } from 'shared/zod';

export const NotificationId = brandedEntityId('Notification');

export type NotificationId = z.infer<typeof NotificationId>;

export const NotificationContent = z.string().min(5).max(240);

export const Notification = z
  .strictObject({
    id: NotificationId,
    content: NotificationContent,
    category: z.string().min(1),
    receiverId: ulidSchema(),
    readAt: z.date().nullable().transform(O.fromNullable),
    createdAt: z.date(),
  })
  .brand('Notification');

export type NotificationInput = z.input<typeof Notification>;

export type Notification = z.infer<typeof Notification>;
