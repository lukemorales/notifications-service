import { option } from 'fp-ts';
import { flow } from 'fp-ts/function';

export * from 'fp-ts/Option';

/**
 * Wrap all properties in `T` with an `Option`.
 */
export type Optional<T extends Record<string, unknown>> = {
  [P in keyof T]: option.Option<T[P]>;
};

/**
 * Constructs a new `Option` from a nullable type. If the value is null or undefined, returns `None`, otherwise returns the value wrapped in a `Some` while applying the effect provided.
 *
 */
export const fromNullableMap = <T, U>(
  mapping: (value: T) => U,
): ((value: T | null | undefined) => option.Option<U>) =>
  flow(option.fromNullable, option.map(mapping));

/**
 * Applies the provided mapping function to an `Option` and extracts the value out of the structure, if it exists. Otherwise returns `undefined` .
 *
 */
export const mapToUndefined = <T, U>(
  f: (value: T) => U,
): ((value: option.Option<T>) => U | undefined) =>
  flow(option.map(f), option.toUndefined);

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
  f: (value: T) => U,
): ((value: T | null | undefined) => U | undefined) =>
  flow(option.fromNullable, mapToUndefined(f));
