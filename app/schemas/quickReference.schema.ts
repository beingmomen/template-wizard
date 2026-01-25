import { z } from 'zod'

export const projectTypeEnum = z.enum([
  'fullstack',
  'frontend-only',
  'backend-only',
  'chrome-extension',
  'cli-tool',
  'library',
  'integration'
])

export const projectSizeEnum = z.enum(['small', 'medium', 'large'])

export const quickReferenceSchema = z.object({
  projectType: projectTypeEnum,
  projectSize: projectSizeEnum,
  projectName: z.string().min(2, 'اسم المشروع مطلوب (حرفين على الأقل)'),
  projectNameTechnical: z.string()
    .min(2, 'الاسم التقني مطلوب')
    .regex(/^[a-z][a-z0-9-]*$/, 'الاسم التقني يجب أن يكون بحروف صغيرة وبدون مسافات'),
  problemStatement: z.string().min(20, 'وصف المشكلة قصير جداً (20 حرف على الأقل)'),
  solutionDescription: z.string().min(20, 'وصف الحل قصير جداً (20 حرف على الأقل)'),
  targetUsers: z.string().min(5, 'حدد المستخدمين المستهدفين'),
  targetUserType: z.enum(['individuals', 'companies', 'both']).default('both'),
  targetUserLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  primaryLanguage: z.enum(['ar', 'en', 'both']).default('ar')
})

export type QuickReferenceData = z.infer<typeof quickReferenceSchema>

export const projectTypeOptions = [
  { value: 'fullstack', label: 'Fullstack App', labelAr: 'تطبيق كامل', descAr: 'Frontend + Backend متكامل', icon: 'i-lucide-layers' },
  { value: 'frontend-only', label: 'Frontend Only', labelAr: 'واجهة فقط', descAr: 'SPA أو SSG بدون Backend خاص', icon: 'i-lucide-layout' },
  { value: 'backend-only', label: 'Backend Only', labelAr: 'Backend فقط', descAr: 'API أو خدمة بدون واجهة', icon: 'i-lucide-server' },
  { value: 'chrome-extension', label: 'Chrome Extension', labelAr: 'إضافة متصفح', descAr: 'إضافة لـ Chrome أو متصفحات أخرى', icon: 'i-lucide-puzzle' },
  { value: 'cli-tool', label: 'CLI Tool', labelAr: 'أداة CLI', descAr: 'أداة سطر أوامر أو script', icon: 'i-lucide-terminal' },
  { value: 'library', label: 'Library/Package', labelAr: 'مكتبة', descAr: 'NPM Package أو SDK', icon: 'i-lucide-package' },
  { value: 'integration', label: 'Integration', labelAr: 'تكامل', descAr: 'تكامل مع خدمات خارجية (AI, APIs)', icon: 'i-lucide-plug' }
]
