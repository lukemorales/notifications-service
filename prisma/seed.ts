/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';
import Chance from 'chance';
import { randPhrase } from '@ngneat/falso';

import { NotificationModelCategory } from '@features/notifications/notification.model';
import { RecipientId } from '@features/recipients/recipient.entity';

const prisma = new PrismaClient();
const main = async () => {
  const notifications = await prisma.notification.findMany();

  if (notifications.length > 0) {
    return;
  }

  const chance = new Chance();
  const recipientIds = Array.from({ length: 5 }, () => ulid());

  for (const recipientId of recipientIds) {
    const amount = Array.from(
      { length: chance.integer({ min: 3, max: 10 }) },
      (_, i) => i,
    );

    for (const _ in amount) {
      let content = randPhrase();

      while (content.length < 5) {
        content = randPhrase();
      }

      await prisma.notification.create({
        data: {
          id: ulid(),
          content: content.substring(0, 240),
          category: chance.pickone(NotificationModelCategory.options),
          recipient_id: RecipientId.parse(recipientId),
        },
      });
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
