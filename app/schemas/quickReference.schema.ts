import { z } from 'zod'

export const projectSizeEnum = z.enum(['small', 'medium', 'large'])

export const quickReferenceSchema = z.object({
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
