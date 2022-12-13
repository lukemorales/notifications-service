import { pipe } from 'fp-ts/function';
import type { z } from 'zod';

import type { O } from './fp-ts';
import { coerce } from './fp-ts';

export const toSerializableSchema = <
  T extends z.ZodBranded<z.SomeZodObject, string>,
  X extends ReturnType<T['unwrap']>['shape'],
  K extends {
    [P in keyof X]: X[P] extends z.ZodEffects<z.ZodTypeAny, O.Option<unknown>>
      ? P
      : never;
  }[keyof X],
  S extends Record<K, z.ZodTypeAny>,
>(
  entitySchema: T,
  thunk: (shape: Pick<X, K>) => z.ZodObject<S>,
) => {
  type $MergedSchema = Omit<X, K> & S;

  type $MergedSchemaOutput<Target extends '_output' | '_input'> = {
    [Key in keyof $MergedSchema]: $MergedSchema[Key][Target];
  };

  const schema = entitySchema.unwrap();

  return pipe(
    schema.merge(thunk(schema.shape as Pick<X, K>)),
    coerce<
      z.ZodObject<
        z.extendShape<X, S>,
        'strict',
        z.ZodTypeAny,
        $MergedSchemaOutput<'_output'>,
        $MergedSchemaOutput<'_input'>
      >
    >,
  );
};
