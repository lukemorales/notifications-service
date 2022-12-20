import type { O } from './fp-ts';

export const createDefaultEntityUpdateOptions =
  <T extends O.Optional<Record<string, unknown>>>(defaultOptions: T) =>
  (options: Partial<T>) => ({ ...defaultOptions, ...options });
