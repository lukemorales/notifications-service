import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import assert from 'assert';
import { O } from 'funkcia';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { generatePrismock } from 'prismock';
import type { PrismockClient } from 'prismock/build/main/lib/client';

import { ClockModule } from '@features/clock/clock.module';
import { ClockService } from '@features/clock/clock.service';
import { RecipientFactory } from '@features/recipients/factories/recipient.factory';
import { RecipientId } from '@features/recipients/recipient.entity';

import { NotificationFactory } from './factories/notification.factory';
import { NotificationId } from './notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';
import { PrismaNotificationsRepository } from './repositories/prisma-notifications.repository';

describe('NotificationsService', () => {
  let clock: ClockService;
  let sut: NotificationsService;
  let repository: PrismockClient;

  beforeEach(async () => {
    const prismock = await generatePrismock();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ClockModule],
      providers: [
        NotificationsService,
        {
          provide: NotificationsRepository,
          useClass: PrismaNotificationsRepository,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prismock)
      .compile();

    clock = module.get(ClockService);
    sut = module.get(NotificationsService);
    repository = module.get(NotificationsRepository);

    repository = prismock;
    repository.setData({ notification: [] });
  });

  describe('countAllByReceiverId', () => {
    const performSetup = () => {
      const { id: recipientId } = RecipientFactory.create();
      const recipientNotifications = [1, 2, 3].map(() =>
        NotificationFactory.create({ recipientId }),
      );

      const otherNotifications = [1, 2, 3, 4, 5].map(() =>
        NotificationFactory.create(),
      );

      repository.setData({
        notification: [...recipientNotifications, ...otherNotifications],
      });

      return { recipientId: RecipientId.parse(recipientId) };
    };

    it('counts the total of notifications sent to the specified recipient', async () => {
      const { recipientId } = performSetup();

      const count = await sut.countAllByRecipientId(recipientId);

      expect(count).toBe(3);
    });
  });

  describe('dispatch', () => {
    it('creates and dispatches a new notification', async () => {
      const { id: recipientId } = RecipientFactory.create();

      const notification = await sut.dispatch({
        category: 'News',
        content: 'x'.repeat(5),
        recipientId,
      });

      expect(notification).toEqual(
        expect.objectContaining({
          category: 'News',
          content: 'xxxxx',
          recipientId,
        }),
      );
    });
  });

  describe('findAllByReceiverId', () => {
    const performSetup = () => {
      const { id: recipientId } = RecipientFactory.create();

      const recipientNotifications = [1, 2, 3].map(() =>
        NotificationFactory.create({ recipientId }),
      );

      const otherNotifications = [1, 2, 3, 4, 5].map(() =>
        NotificationFactory.create(),
      );

      repository.setData({
        notification: [...recipientNotifications, ...otherNotifications],
      });

      return { recipientId };
    };

    it('finds all notifications sent to the specified recipient', async () => {
      const { recipientId } = performSetup();

      const notifications = await sut.findAllByRecipientId(recipientId);

      expect(notifications).toHaveLength(3);
      expect(notifications).toEqual([
        expect.objectContaining({ recipientId }),
        expect.objectContaining({ recipientId }),
        expect.objectContaining({ recipientId }),
      ]);
    });
  });

  describe('findOne', () => {
    it('finds a notification', async () => {
      const model = NotificationFactory.create();
      repository.setData({ notification: [model] });

      const targetId = NotificationId.parse(model.id);

      const notification = await sut.findOne(targetId);

      assert.ok(O.isSome(notification));

      expect(notification.value).toEqual(
        expect.objectContaining({
          id: targetId,
        }),
      );
    });
  });

  describe('invalidate', () => {
    it('invalidates a notification', async () => {
      const timestamp = new Date();

      const model = NotificationFactory.create({
        canceledAt: timestamp,
      });
      repository.setData({ notification: [model] });

      const targetId = NotificationId.parse(model.id);

      await sut.invalidate(targetId);

      const invalidatedNotification =
        await repository.notification.findUniqueOrThrow({
          where: { id: model.id },
        });

      expect(invalidatedNotification).toEqual(
        expect.objectContaining({
          canceled_at: timestamp,
        }),
      );
    });
  });

  describe('markAsRead', () => {
    it('invalidates a notification', async () => {
      const timestamp = new Date();

      const model = NotificationFactory.create();
      repository.setData({ notification: [model] });

      jest.spyOn(clock, 'now', 'get').mockReturnValue(timestamp);

      const targetId = NotificationId.parse(model.id);

      const notification = await sut.markAsRead(targetId);

      expect(notification).toEqual(
        expect.objectContaining({
          readAt: O.some(timestamp),
        }),
      );
    });
  });

  describe('markAsUnread', () => {
    it('invalidates a notification', async () => {
      const model = NotificationFactory.create({
        readAt: new Date(),
      });
      repository.setData({ notification: [model] });

      const targetId = NotificationId.parse(model.id);

      const notification = await sut.markAsUnread(targetId);

      expect(notification).toEqual(
        expect.objectContaining({
          readAt: O.none,
        }),
      );
    });
  });
});
