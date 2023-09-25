import type { Option } from 'funkcia';
import { coerce, pipe } from 'funkcia';
import { type z } from 'zod';

export const toSerializableSchema = <
  T extends z.ZodBranded<z.SomeZodObject, string>,
  X extends ReturnType<T['unwrap']>['shape'],
  K extends {
    [P in keyof X]: X[P] extends z.ZodEffects<z.ZodTypeAny, Option<unknown>>
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
