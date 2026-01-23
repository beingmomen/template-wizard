import { z } from 'zod'

const pageSchema = z.object({
  path: z.string().min(1, 'المسار مطلوب').startsWith('/', 'المسار يجب أن يبدأ بـ /'),
  name: z.string().min(2, 'اسم الصفحة مطلوب'),
  description: z.string().min(5, 'الوصف مطلوب'),
  auth: z.boolean()
})

export const frontendSchema = z.object({
  pages: z.array(pageSchema).min(1, 'أضف صفحة واحدة على الأقل'),
  sharedComponents: z.string().optional()
})

export type FrontendData = z.infer<typeof frontendSchema>
