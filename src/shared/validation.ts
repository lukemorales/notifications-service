import { BadRequestException } from '@nestjs/common';

import type { Result } from 'funkcia';
import { R, coerce, flow } from 'funkcia';
import type { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const zodDecode = <T extends z.ZodType, ParsedData = T['_output']>(
  codec: T,
) =>
  R.liftThrowable(
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
  parseResult: Result<E, T>,
) =>
  parseResult.pipe(
    R.getOrElse((error) => {
      // eslint-disable-next-line no-console
      console.log(error.flatten());

      throw new BadRequestException(fromZodError(error));
    }),
  );
