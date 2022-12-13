import { O } from 'shared/fp-ts';
import { toSerializableSchema } from 'shared/to-serializable-schema';
import { optionSchema } from 'shared/zod';
import { z } from 'zod';

import { Notification } from './notification.entity';

const SerializableNotification = toSerializableSchema(Notification, (shape) =>
  z.object({
    readAt: optionSchema(shape.readAt).transform(O.toNullable),
  }),
);

export const notificationTransformer = (notification: Notification) =>
  SerializableNotification.parse(notification);
