import type { Option } from 'funkcia';
import { O, pipe } from 'funkcia';
import { z } from 'zod';

import { RecipientId } from '@features/recipients/recipient.entity';
import { brandedEntityId } from '@shared/zod';

export const NotificationId = brandedEntityId('Notification');

export type NotificationId = z.infer<typeof NotificationId>;

export const NotificationCategory = z.enum(['News', 'Promo', 'Social']);

export type NotificationCategory = z.infer<typeof NotificationCategory>;

export const NotificationContent = z.string().min(5).max(240);

export type NotificationContent = z.infer<typeof NotificationContent>;

export const NotificationSchema = z.strictObject({
  id: NotificationId,
  content: NotificationContent,
  category: NotificationCategory,
  recipientId: RecipientId,
  readAt: z.date().nullable().transform(O.fromNullable),
  canceledAt: z.date().nullable().transform(O.fromNullable),
  createdAt: z.date(),
});

export type NotificationInput = z.input<typeof NotificationSchema>;

export interface NotificationSchema
  extends z.infer<typeof NotificationSchema> {}

export class Notification implements NotificationSchema {
  id: NotificationId;

  content: NotificationContent;

  category: NotificationCategory;

  recipientId: RecipientId;

  readAt: Option<Date>;

  canceledAt: Option<Date>;

  createdAt: Date;

  constructor(input: NotificationInput) {
    Object.assign(this, NotificationSchema.parse(input));
  }

  get hasBeenRead() {
    return pipe(this.readAt, O.isSome);
  }

  get hasBeenCanceled() {
    return pipe(this.canceledAt, O.isSome);
  }
}
