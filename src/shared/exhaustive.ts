type Exhaustive<T extends string> = {
  [Key in T]: (pattern: Key) => unknown;
};

export const exhaustive = <
  T extends string,
  R extends Pattern[keyof Pattern] extends (...args: any[]) => unknown
    ? ReturnType<Pattern[keyof Pattern]>
    : never,
  Pattern extends Exhaustive<T> = Exhaustive<T>,
>(
  target: T,
  match: Pattern,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (target in match === false) {
    throw new TypeError(`Unreachable statement "${target}"`);
  }

  const result = match[target];

  return result(target) as R extends infer Value ? Value : never;
};
