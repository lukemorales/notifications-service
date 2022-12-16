import { option } from 'fp-ts';
import { flow, unsafeCoerce } from 'fp-ts/function';

export {
  string as S,
  readonlyArray as A,
  readonlyRecord as R,
  struct as D,
  either as E,
} from 'fp-ts';

export const coerce = <B>(a: unknown) => unsafeCoerce<unknown, B>(a);

const fromNullableMap = <T, U>(
  mapping: (value: T) => U,
): ((value: T | null | undefined) => option.Option<U>) =>
  flow(option.fromNullable, option.map(mapping));

/**
 * Applies the provided mapping function to a value that is potentially `undefined`.
 *
 * If a non-`undefined` value is provided, the mapping function will be called
 * and the returned value will be the value returned from the mapping function.
 *
 * If an `undefined` value is provided, the mapping function will not be called
 * and the returned value will be `undefined`.
 *
 * ### Example
 *
 * ```ts
 * import { pipe } from 'fp-ts/lib/functions';
 * import { mapUndefined } from '@workos-inc/standard';
 *
 * const square = (n: number) => n * n;
 *
 * const squared = pipe(5, mapUndefined(square));
 * // squared = 25
 *
 * const notSquared = pipe(undefined, mapUndefined(square));
 * // notSquared = undefined
 * ```
 */
const mapToUndefined = <T, U>(
  f: (value: T) => U,
): ((value: T | null | undefined) => U | undefined) =>
  flow(option.fromNullable, option.map(f), option.toUndefined);

export const O = {
  ...option,
  fromNullableMap,
  mapToUndefined,
};
