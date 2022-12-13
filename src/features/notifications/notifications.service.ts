import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';
import { ulid } from 'ulid';
import { ClockService } from 'features/clock/clock.service';
import { unprefixId } from 'shared/unprefix-id';
import { A, O } from 'shared/fp-ts';
import { pipe } from 'fp-ts/function';

import type { CreateNotificationDto } from './dto/create-notification.dto';
import { notificationToDomain } from './notification.domain-adapter';

@Injectable()
export class NotificationsService {
  private readonly repository: PrismaService['notification'];

  constructor(
    private readonly clock: ClockService,
    private readonly persistor: PrismaService,
  ) {
    this.repository = this.persistor.notification;
  }

  async create({ content, category, recipientId }: CreateNotificationDto) {
    const notification = await this.repository.create({
      data: {
        id: ulid(),
        content,
        category,
        receiver_id: recipientId ?? ulid(),
      },
    });

    return pipe(notification, notificationToDomain);
  }

  async findAll() {
    const notifications = await this.repository.findMany();

    return pipe(notifications, A.map(notificationToDomain));
  }

  async findOne(id: string) {
    const notification = await this.repository.findUnique({
      where: { id: unprefixId(id) },
    });

    return pipe(notification, O.fromNullable, O.map(notificationToDomain));
  }

  async update(id: string) {
    const updatedNotification = await this.repository.update({
      where: { id: unprefixId(id) },
      data: {
        read_at: this.clock.now,
      },
    });

    return pipe(updatedNotification, notificationToDomain);
  }

  async remove(id: string) {
    await this.repository.delete({
      where: { id: unprefixId(id) },
    });
  }
}
