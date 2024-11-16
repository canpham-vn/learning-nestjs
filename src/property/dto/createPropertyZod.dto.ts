import { TypeOf, z } from 'zod';

// using zod library to validation in Nestjs
export const CreatePropertySchema = z
  .object({
    name: z.string(),
    description: z.string().min(5),
    area: z.number().positive(),
  })
  .required();

export type CreatePropertyZodDto = z.infer<typeof CreatePropertySchema>;
