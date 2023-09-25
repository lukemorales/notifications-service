import type { Prisma } from '@prisma/client';
import { O, pipe } from 'funkcia';
import { ulid } from 'ulid';

import { RecipientId } from '@features/recipients/recipient.entity';
import type { Optional } from '@shared/fp-ts/option';
import type { KeysToCamelCase } from '@shared/helpers';
import { unprefixId } from '@shared/unprefix-id';

import type { NotificationModel } from '../notification.model';
import { NotificationModelCategory } from '../notification.model';

export class NotificationFactory {
  static create(
    overrides: Partial<KeysToCamelCase<Prisma.NotificationCreateInput>> = {},
  ) {
    const factory = new NotificationFactory();

    const castToDate = (value: string | Date) =>
      typeof value === 'string' ? new Date(value) : value;

    return factory.build({
      id: O.fromNullable(overrides.id).pipe(O.map(unprefixId)),
      content: pipe(overrides.id, O.fromNullable),
      category: O.fromNullable(overrides.category).pipe(
        O.map(NotificationModelCategory.parse),
      ),
      recipient_id: O.fromNullable(overrides.recipientId),
      read_at: O.fromNullable(overrides.readAt).pipe(O.map(castToDate)),
      canceled_at: O.fromNullable(overrides.canceledAt).pipe(O.map(castToDate)),
      created_at: O.fromNullable(overrides.createdAt).pipe(O.map(castToDate)),
    });
  }

  private build(
    overrides: Optional<Required<NotificationModel>>,
  ): NotificationModel {
    return {
      id: overrides.id.pipe(O.getOrElse(ulid)),
      content: overrides.content.pipe(
        O.getOrElse(() => 'xxx.'.repeat(4).slice(0, -1)),
      ),
      category: overrides.category.pipe(
        O.getOrElse(() => NotificationModelCategory.enum.SOCIAL),
      ),
      recipient_id: overrides.recipient_id.pipe(
        O.getOrElse(ulid),
        RecipientId.parse,
      ),
      read_at: overrides.read_at.pipe(O.toNullable),
      canceled_at: overrides.canceled_at.pipe(O.toNullable),
      created_at: overrides.created_at.pipe(O.getOrElse(() => new Date())),
    };
  }
}
