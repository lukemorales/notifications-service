import { some } from 'fp-ts/Option';

type Exhaustive<Y, T extends keyof Y> = {
  [Key in T as string & Y[Key]]: (value: Y) => unknown;
};

/**
 * @deprecated under construction, doesn't work just yet
 */
export const exhaustiveUnion = <
  T,
  K extends keyof T,
  R extends Pattern[keyof Pattern] extends (...args: any[]) => unknown
    ? ReturnType<Pattern[keyof Pattern]>
    : never,
  Pattern extends Exhaustive<T, K> = Exhaustive<T, K>,
>(
  target: T,
  discriminator: K,
  match: Pattern,
) => {
  const key = `${target[discriminator]}`;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (key in match === false) {
    throw new TypeError(`Unreachable statement "${key}"`);
  }

  const result = match[key];

  return result(target) as R extends infer Value ? Value : never;
};

const target = some('yo');

exhaustiveUnion(target, '_tag', {
  None: () => 'yolo' as const,
  Some: (value) => ({ value }),
  //      ^?
}); // ?
