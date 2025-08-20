import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(2, 'Name is required'),

    color: z
      .union([
        z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Must be a valid hex color'),
        z.literal(''),
        z.undefined(),
      ])
      .transform((val) => (val === '' ? undefined : val)),
    description: z
      .string()
      .max(300, 'Description must be under 300 characters')
      .optional(),
  });
  

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
