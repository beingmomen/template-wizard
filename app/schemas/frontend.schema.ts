import { z } from 'zod'

const pageSchema = z.object({
  path: z.string().min(1, 'المسار مطلوب').startsWith('/', 'المسار يجب أن يبدأ بـ /'),
  name: z.string().min(2, 'اسم الصفحة مطلوب'),
  description: z.string().min(5, 'الوصف مطلوب'),
  auth: z.boolean(),
  requiredPermissions: z.array(z.string()).optional(),
  requiredRoles: z.array(z.string()).optional()
})

const moduleSchema = z.object({
  name: z.string().min(1, 'اسم الـ Module مطلوب'),
  basePath: z.string().optional(),
  description: z.string().optional(),
  pages: z.array(pageSchema).optional()
})

const sharedComponentSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['layout', 'data', 'feedback', 'form', 'navigation', 'utility'])
})

const templateModeSchema = z.object({
  frontendMode: z.literal('template'),
  selectedTemplate: z.string().min(1, 'يجب اختيار قالب'),
  pages: z.array(pageSchema).optional(),
  frontendModules: z.array(moduleSchema).optional(),
  sharedComponents: z.array(sharedComponentSchema).optional()
})

const customModeSchema = z.object({
  frontendMode: z.literal('custom'),
  selectedTemplate: z.string().nullable().optional(),
  pages: z.array(pageSchema).optional(),
  frontendModules: z.array(moduleSchema).optional(),
  sharedComponents: z.array(sharedComponentSchema).optional()
}).refine(
  (data) => {
    const hasLegacyPages = data.pages && data.pages.length > 0
    const hasModulePages = data.frontendModules && data.frontendModules.some(m => m.pages && m.pages.length > 0)
    return hasLegacyPages || hasModulePages
  },
  { message: 'أضف صفحة واحدة على الأقل', path: [] }
)

export const frontendSchema = z.discriminatedUnion('frontendMode', [
  templateModeSchema,
  customModeSchema
])

export type FrontendData = z.infer<typeof frontendSchema>
