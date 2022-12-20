import type { z } from 'zod';

import { brandedEntityId } from '@shared/zod';

export const RecipientId = brandedEntityId('Recipient');

export type RecipientId = z.infer<typeof RecipientId>;
