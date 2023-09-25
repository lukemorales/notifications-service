import { O } from 'funkcia';
import { ulid } from 'ulid';

import type { Optional } from '@shared/fp-ts/option';

import { RecipientId } from '../recipient.entity';

type RecipientFactoryInput = {
  id: string;
};

export class RecipientFactory {
  static create(overrides: Partial<RecipientFactoryInput> = {}) {
    const factory = new RecipientFactory();

    return factory.build({
      id: O.fromNullable(overrides.id),
    });
  }

  private build(overrides: Optional<RecipientFactoryInput>) {
    return {
      id: overrides.id.pipe(O.getOrElse(ulid), RecipientId.parse),
    };
  }
}
