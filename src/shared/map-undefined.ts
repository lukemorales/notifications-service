import { flow } from 'fp-ts/function';

import { O } from './fp-ts';

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
export const mapUndefined = <T, U>(
  mapping: (value: T) => U,
): ((value: T | null | undefined) => U | undefined) =>
  flow(O.fromNullable, O.map(mapping), O.toUndefined);
