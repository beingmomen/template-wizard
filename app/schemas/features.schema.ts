import { z } from 'zod'

const edgeCaseSchema = z.object({
  scenario: z.string().min(5, 'السيناريو مطلوب'),
  handling: z.string().min(10, 'طريقة المعالجة مطلوبة')
})

const phaseSchema = z.object({
  phaseName: z.string().min(2, 'اسم المرحلة مطلوب'),
  tasks: z.array(z.string().min(5, 'المهمة قصيرة جداً')).min(1, 'أضف مهمة واحدة على الأقل')
})

// Schema for small projects
export const featuresSchemaSmall = z.object({
  mvpFeatures: z.array(z.string().min(5)).min(1, 'أضف ميزة واحدة على الأقل'),
  futureFeatures: z.array(z.string()).optional(),
  wireframes: z.string().optional(),
  edgeCases: z.array(edgeCaseSchema).optional(),
  implementationPhases: z.array(phaseSchema).optional()
})

// Schema for medium/large projects (phases optional)
export const featuresSchemaExtended = z.object({
  mvpFeatures: z.array(z.string().min(5)).min(1, 'أضف ميزة واحدة على الأقل'),
  futureFeatures: z.array(z.string()).optional(),
  wireframes: z.string().optional(),
  edgeCases: z.array(edgeCaseSchema).optional(),
  implementationPhases: z.array(phaseSchema).optional()
})

export type FeaturesData = z.infer<typeof featuresSchemaSmall>
export type FeaturesDataExtended = z.infer<typeof featuresSchemaExtended>
