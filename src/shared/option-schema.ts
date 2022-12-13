import type { ZodTypeAny } from 'zod';
import { z } from 'zod';

import type { O } from './fp-ts';

export const optionSchema = <T extends ZodTypeAny>(_: T) =>
  z.custom<O.Option<NonNullable<T['_input']>>>(
    (val) =>
      val != null &&
      typeof val === 'object' &&
      '_tag' in val &&
      new Set<unknown>(['Some', 'None']).has(val._tag),
  );
