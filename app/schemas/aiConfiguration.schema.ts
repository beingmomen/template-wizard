import { z } from 'zod'

const aiModelSchema = z.object({
  name: z.string().min(1, 'اسم النموذج مطلوب'),
  isOpenSource: z.boolean(),
  isAPI: z.boolean(),
  offlineSupport: z.boolean()
})

export const aiConfigurationSchema = z.object({
  aiConfiguration: z.object({
    domains: z.array(z.string().min(1)).min(1, 'أضف مجال واحد على الأقل'),
    models: z.array(aiModelSchema).min(1, 'أضف نموذج ذكاء واحد على الأقل'),
    supportedLanguages: z.array(z.string()),
    hardwarePreference: z.enum(['gpu-preferred', 'cpu-preferred', 'cpu-only', 'any'])
  })
})

export type AIConfigurationData = z.infer<typeof aiConfigurationSchema>
