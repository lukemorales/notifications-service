/**
 * Returns the database ID with any prefixes removed.
 */
export const unprefixId = <BrandedId extends string>(id: BrandedId) =>
  id.split(/(:|_)/gi).slice(-1).join('_');
