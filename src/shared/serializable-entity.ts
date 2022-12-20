import type { Option } from 'fp-ts/Option';
import type { z } from 'zod';

export type SerializableEntity<Entity extends Record<string, unknown>> = {
  [Key in Exclude<keyof Entity, typeof z.BRAND>]: Entity[Key] extends Option<
    infer T
  >
    ? T | null
    : Entity[Key];
};
