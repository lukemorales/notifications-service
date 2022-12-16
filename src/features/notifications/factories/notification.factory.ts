import { ulid } from 'ulid';

import type { NotificationInput } from '../notification.entity';
import { ReceiverId } from '../notification.entity';
import { NotificationId } from '../notification.entity';
import { Notification } from '../notification.entity';

type NotificationOverrides = Partial<NotificationInput>;

export const makeNotification = (
  overrides: NotificationOverrides = {},
): Notification =>
  Notification.parse({
    id: ulid(),
    content: 'xxx.'.repeat(4).slice(0, -1),
    category: 'NEWS',
    receiverId: ulid(),
    readAt: null,
    canceledAt: null,
    createdAt: new Date(),
    ...overrides,
  } satisfies NotificationInput);

export const makeNotificationId = () => NotificationId.parse(ulid());

export const makeReceiverId = () => ReceiverId.parse(ulid());
