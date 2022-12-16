import { BadRequestException } from '@nestjs/common';

import { flow, pipe } from 'fp-ts/function';
import type { z } from 'zod';

import { coerce, E } from './fp-ts';

export const zodDecode = <T extends z.ZodType, ParsedData = T['_output']>(
  codec: T,
) =>
  E.tryCatchK(
    flow(codec.parse, coerce<ParsedData>),
    coerce<z.ZodError<ParsedData>>,
  );

/**
 * Throws an exception upon encountering a parse error.
 *
 * When given a `Left` this function throws a BadRequestException using the parse error
 * contained in the `Left`.
 *
 * When given a `Right` this function returns value in the `Right`.
 */
export const throwBadRequestOnParseError = <E extends z.ZodError<T>, T>(
  parseResult: E.Either<E, T>,
) =>
  pipe(
    parseResult,
    E.getOrElse((error) => {
      // eslint-disable-next-line no-console
      console.log(error.flatten());

      throw new BadRequestException(
        'Validation error',
        error.errors.map((err) => JSON.stringify(err, null, 2)).join(', '),
      );
    }),
  );
