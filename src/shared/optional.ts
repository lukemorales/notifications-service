import type { Option } from 'fp-ts/Option';

/**
 * Wrap all properties in `T` with an `Option`.
 */
export type Optional<T extends Record<string, unknown>> = {
  [P in keyof T]: Option<T[P]>;
};
