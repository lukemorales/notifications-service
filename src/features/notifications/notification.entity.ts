import { z } from 'zod';

import type { Unbranded } from '@shared/zod';
import { brandedEntityId } from '@shared/zod';
import { O } from '@shared/fp-ts';

export const ReceiverId = brandedEntityId('Receiver');

export type ReceiverId = z.infer<typeof ReceiverId>;

export const NotificationId = brandedEntityId('Notification');

export type NotificationId = z.infer<typeof NotificationId>;

export const NotificationCategory = z.enum(['SOCIAL', 'NEWS', 'PROMO']);

export type NotificationCategory = z.infer<typeof NotificationCategory>;

export const NotificationContent = z.string().min(5).max(240);

export const Notification = z
  .strictObject({
    id: NotificationId,
    content: NotificationContent,
    category: z.string().min(1).pipe(NotificationCategory),
    receiverId: ReceiverId,
    readAt: z.date().nullable().transform(O.fromNullable),
    canceledAt: z.date().nullable().transform(O.fromNullable),
    createdAt: z.date(),
  })
  .brand('Notification');

export type NotificationInput = z.input<typeof Notification>;

export interface Notification extends z.infer<typeof Notification> {}

export type NotificationSchema = Unbranded<typeof Notification>;
