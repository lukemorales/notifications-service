import { z } from 'zod';
import { pipe } from 'fp-ts/function';

import type { O } from './fp-ts';
import { S } from './fp-ts';
import { unprefixId } from './unprefix-id';

export const ulidSchema = () =>
  z
    .string()
    .refine((val) => /[0-9A-HJKMNP-TV-Z]{26}/.test(val), 'Invalid ULID');

export const optionSchema = <T extends z.ZodTypeAny>(_: T) =>
  z.custom<O.Option<NonNullable<T['_input']>>>(
    (val) =>
      val != null &&
      typeof val === 'object' &&
      '_tag' in val &&
      new Set<unknown>(['Some', 'None']).has(val._tag),
  );

export const brandedEntityId = <Entity extends string>(entity: Entity) => {
  const prefix = entity
    .split(/\.?(?=[A-Z])/)
    .join(':')
    .toLowerCase();

  return (
    z
      .string()
      .describe(`Branded id for domain of entity ${entity}`)
      // eslint-disable-next-line consistent-return
      .superRefine((id, ctx) => {
        const pieces = pipe(id, S.split(':'));

        const [prefixOrId] = pieces;
        const valueHasEntityPrefix = pieces.length !== 1;

        if (valueHasEntityPrefix && prefixOrId !== prefix) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_string,
            validation: 'regex',
            path: ['id prefix', prefixOrId],
            message: `Invalid entity id "${id}", if you're trying to use the same value from another entity, make sure to unprefix it first`,
            fatal: true,
          });

          return z.NEVER;
        }
      })
      .transform((id) => `${prefix}:${unprefixId(id)}`)
      .brand<`${Entity}Id`>()
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unbranded<T extends z.ZodBranded<any, any>> = z.infer<
  ReturnType<T['unwrap']>
>;