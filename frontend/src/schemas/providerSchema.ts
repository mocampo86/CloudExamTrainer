import { z } from 'zod'

export const providerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().min(1),
  color: z.string().min(1),
})
