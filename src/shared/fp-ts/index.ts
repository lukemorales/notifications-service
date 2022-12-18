import { unsafeCoerce } from 'fp-ts/function';

export {
  string as S,
  readonlyArray as A,
  readonlyRecord as R,
  either as E,
} from 'fp-ts';

export const coerce = <B>(a: unknown) => unsafeCoerce<unknown, B>(a);

export * as O from './option';
