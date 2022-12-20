import type { Prisma } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import { ulid } from 'ulid';

import { O } from '@shared/fp-ts';
import type { KeysToCamelCase } from '@shared/helpers';
import { unprefixId } from '@shared/unprefix-id';
import { RecipientId } from '@features/recipients/recipient.entity';

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
      id: pipe(overrides.id, O.fromNullableMap(unprefixId)),
      content: pipe(overrides.id, O.fromNullable),
      category: pipe(
        overrides.category,
        O.fromNullableMap(NotificationModelCategory.parse),
      ),
      recipient_id: pipe(overrides.recipientId, O.fromNullable),
      read_at: pipe(overrides.readAt, O.fromNullableMap(castToDate)),
      canceled_at: pipe(overrides.canceledAt, O.fromNullableMap(castToDate)),
      created_at: pipe(overrides.createdAt, O.fromNullableMap(castToDate)),
    });
  }

  private build(
    overrides: O.Optional<Required<NotificationModel>>,
  ): NotificationModel {
    return {
      id: pipe(overrides.id, O.getOrElse(ulid)),
      content: pipe(
        overrides.content,
        O.getOrElse(() => 'xxx.'.repeat(4).slice(0, -1)),
      ),
      category: pipe(
        overrides.category,
        O.getOrElse(() => NotificationModelCategory.enum.SOCIAL),
      ),
      recipient_id: pipe(
        overrides.recipient_id,
        O.getOrElse(ulid),
        RecipientId.parse,
      ),
      read_at: pipe(overrides.read_at, O.toNullable),
      canceled_at: pipe(overrides.canceled_at, O.toNullable),
      created_at: pipe(
        overrides.created_at,
        O.getOrElse(() => new Date()),
      ),
    };
  }
}
