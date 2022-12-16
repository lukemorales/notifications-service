import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import assert from 'assert';
import { pipe } from 'fp-ts/function';

import { A, O } from '@shared/fp-ts';
import { ClockService } from '@features/clock/clock.service';
import { ClockModule } from '@features/clock/clock.module';

import { NotificationsService } from './notifications.service';
import { InMemoryNotificationRepository } from './repositories/in-memory.notifications.repository';
import { NotificationsRepository } from './repositories/notifications.repository';
import {
  makeNotification,
  makeReceiverId,
} from './factories/notification.factory';

describe('NotificationsService', () => {
  let clock: ClockService;
  let sut: NotificationsService;
  let repository: InMemoryNotificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClockModule],
      providers: [
        NotificationsService,
        {
          provide: NotificationsRepository,
          useClass: InMemoryNotificationRepository,
        },
      ],
    }).compile();

    clock = module.get(ClockService);
    sut = module.get(NotificationsService);
    repository = module.get(NotificationsRepository);
  });

  describe('countAllByReceiverId', () => {
    const performSetup = () => {
      const receiverId = makeReceiverId();
      const receiverNotifications = [1, 2, 3].map(() =>
        makeNotification({ receiverId }),
      );

      const otherNotifications = [1, 2, 3, 4, 5].map(() => makeNotification());

      repository.items.push(...receiverNotifications, ...otherNotifications);

      return { receiverId };
    };

    it('counts the total of notifications sent to the specified receiver', async () => {
      const { receiverId } = performSetup();

      const count = await sut.countAllByReceiverId(receiverId);

      expect(count).toBe(3);
    });
  });

  describe('dispatch', () => {
    it('creates and dispatches a new notification', async () => {
      const receiverId = makeReceiverId();

      const notification = await sut.dispatch({
        category: 'NEWS',
        content: 'x'.repeat(5),
        receiverId,
      });

      expect(notification).toEqual(
        expect.objectContaining({
          category: 'NEWS',
          content: 'xxxxx',
          receiverId,
        }),
      );
    });
  });

  describe('findAllByReceiverId', () => {
    const performSetup = () => {
      const receiverId = makeReceiverId();
      const receiverNotifications = [1, 2, 3].map(() =>
        makeNotification({ receiverId }),
      );

      const otherNotifications = [1, 2, 3, 4, 5].map(() => makeNotification());

      repository.items.push(...receiverNotifications, ...otherNotifications);

      return { receiverId };
    };

    it('finds all notifications sent to the specified receiver', async () => {
      const { receiverId } = performSetup();

      const notifications = await sut.findAllByReceiverId(receiverId);

      expect(notifications).toHaveLength(3);
      expect(notifications).toEqual([
        expect.objectContaining({ receiverId }),
        expect.objectContaining({ receiverId }),
        expect.objectContaining({ receiverId }),
      ]);
    });
  });

  describe('findOne', () => {
    it('finds a notification', async () => {
      const target = makeNotification();
      repository.items.push(target);

      const notification = await sut.findOne(target.id);

      assert.ok(O.isSome(notification));

      expect(notification.value).toEqual(
        expect.objectContaining({
          id: target.id,
        }),
      );
    });
  });

  describe('invalidate', () => {
    it('invalidates a notification', async () => {
      const timestamp = new Date();

      const target = makeNotification({
        canceledAt: timestamp,
      });
      repository.items.push(target);

      await sut.invalidate(target.id);

      const invalidatedNotification = pipe(
        repository.items,
        A.findFirst((notification) => notification.id === target.id),
      );

      assert.ok(O.isSome(invalidatedNotification));

      expect(invalidatedNotification.value).toEqual(
        expect.objectContaining({
          canceledAt: O.some(timestamp),
        }),
      );
    });
  });

  describe('markAsRead', () => {
    it('invalidates a notification', async () => {
      const timestamp = new Date();

      const target = makeNotification();
      repository.items.push(target);

      jest.spyOn(clock, 'now', 'get').mockReturnValue(timestamp);

      const notification = await sut.markAsRead(target.id);

      expect(notification).toEqual(
        expect.objectContaining({
          readAt: O.some(timestamp),
        }),
      );
    });
  });

  describe('markAsUnread', () => {
    it('invalidates a notification', async () => {
      const target = makeNotification({
        readAt: new Date(),
      });
      repository.items.push(target);

      const notification = await sut.markAsUnread(target.id);

      expect(notification).toEqual(
        expect.objectContaining({
          readAt: O.none,
        }),
      );
    });
  });
});
