import type { Option } from 'funkcia';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTaggedObject = (obj: unknown): obj is Record<'_tag', any> =>
  obj != null && typeof obj === 'object' && '_tag' in obj;

export const ulidSchema = () =>
  z
    .string()
    .refine((val) => /[0-9A-HJKMNP-TV-Z]{26}/.test(val), 'Invalid ULID');

export const optionSchema = <
  S extends z.ZodTypeAny,
  T = S['_output'] extends Option<unknown> ? S['_output'] : never,
>(
  _: S,
) =>
  z.custom<T>(
    (val): val is T =>
      isTaggedObject(val) &&
      new Set<Option<unknown>['_tag']>(['Some', 'None']).has(val._tag),
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unbranded<T extends z.ZodBranded<any, any>> = z.infer<
  ReturnType<T['unwrap']>
>;
