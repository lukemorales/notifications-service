import { unsafeCoerce } from 'fp-ts/function';

export {
  option as O,
  string as S,
  readonlyArray as A,
  either as E,
} from 'fp-ts';

export const coerce = <B>(a: unknown) => unsafeCoerce<unknown, B>(a);
