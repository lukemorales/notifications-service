import type { Optional } from './fp-ts/option';

export const createDefaultEntityUpdateOptions =
  <T extends Optional<Record<string, unknown>>>(defaultOptions: T) =>
  (options: Partial<T>) => ({ ...defaultOptions, ...options });
