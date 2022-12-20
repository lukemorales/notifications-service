import { pipe } from 'fp-ts/function';
import { ulid } from 'ulid';

import { O } from '@shared/fp-ts';

import { RecipientId } from '../recipient.entity';

type RecipientFactoryInput = {
  id: string;
};

export class RecipientFactory {
  static create(overrides: Partial<RecipientFactoryInput> = {}) {
    const factory = new RecipientFactory();

    return factory.build({
      id: pipe(overrides.id, O.fromNullable),
    });
  }

  private build(overrides: O.Optional<RecipientFactoryInput>) {
    return {
      id: pipe(overrides.id, O.getOrElse(ulid), RecipientId.parse),
    };
  }
}
