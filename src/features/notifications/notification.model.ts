import type { Notification } from '@prisma/client';
import { z } from 'zod';

export const NotificationModelCategory = z.enum(['SOCIAL', 'NEWS', 'PROMO']);

export type NotificationModelCategory = z.infer<
  typeof NotificationModelCategory
>;

export interface NotificationModel extends Notification {}
