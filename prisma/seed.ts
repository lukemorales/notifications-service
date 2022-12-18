/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';
import Chance from 'chance';
import { randPhrase } from '@ngneat/falso';

import { NotificationCategory } from '../src/features/notifications/notification.entity';

const prisma = new PrismaClient();
const main = async () => {
  const notifications = await prisma.notification.findMany();

  if (notifications.length > 0) {
    return;
  }

  const chance = new Chance();
  const receiverIds = Array.from({ length: 5 }, () => ulid());

  for (const receiverId of receiverIds) {
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
          content,
          category: chance.pickone(NotificationCategory.options),
          receiver_id: receiverId,
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
