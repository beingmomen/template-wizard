import { z } from 'zod'

export const typeScriptOptions = [
  { label: 'JavaScript فقط (ما عدا ملفات config)', value: 'config-only' },
  { label: 'TypeScript كامل', value: 'full' }
]

export const guidelinesSchema = z.object({
  useTypeScript: z.enum(['config-only', 'full']).default('config-only'),
  developmentWarnings: z.array(z.object({
    warning: z.string().min(1, 'نص التحذير مطلوب'),
    enabled: z.boolean(),
    isDefault: z.boolean().optional()
  })).optional(),
  includeMcpJson: z.boolean()
})

export const defaultWarnings = [
  { warning: 'قبل إنشاء أي صفحة أو component، قم بمراجعة MCP servers الخاصة بـ Nuxt & Nuxt UI', enabled: true, isDefault: true },
  { warning: 'استخدم Zod schemas للتحقق من جميع المدخلات في Backend', enabled: true, isDefault: true },
  { warning: 'اتبع نمط RTL في جميع عناصر الواجهة العربية', enabled: true, isDefault: true },
  { warning: 'لا تستخدم TypeScript في ملفات Vue ما عدا إذا تم اختيار "TypeScript كامل"', enabled: true, isDefault: true },
  { warning: 'استخدم composables بدلاً من mixins أو store مباشر', enabled: true, isDefault: true },
  { warning: 'تجنب استخدام any في TypeScript - استخدم أنواع محددة', enabled: true, isDefault: true },
  { warning: 'تأكد من معالجة الأخطاء (Error handling) في كل API call', enabled: true, isDefault: true },
  { warning: 'أضف loading states لكل عملية async', enabled: true, isDefault: true },
  { warning: 'استخدم دائماً أحدث إصدارات Nuxt & Nuxt UI & Zod', enabled: true, isDefault: true }
]
