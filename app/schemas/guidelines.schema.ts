import { z } from 'zod'

export const typeScriptOptions = [
  { label: 'JavaScript فقط (ما عدا ملفات config)', value: 'config-only' },
  { label: 'TypeScript كامل', value: 'full' }
]

export const guidelinesSchema = z.object({
  useTypeScript: z.enum(['config-only', 'full']).default('config-only'),
  developmentWarnings: z.array(z.object({
    warning: z.string().min(1, 'نص التحذير مطلوب')
  })).optional()
})

// المحاذير الافتراضية
export const defaultWarnings = [
  { warning: 'قبل إنشاء أي صفحة أو component، قم بمراجعة MCP servers الخاصة بـ Nuxt & Nuxt UI' },
  { warning: 'استخدم Zod schemas للتحقق من جميع المدخلات في Backend' },
  { warning: 'اتبع نمط RTL في جميع عناصر الواجهة العربية' },
  { warning: 'لا تستخدم TypeScript في ملفات Vue ما عدا إذا تم اختيار "TypeScript كامل"' },
  { warning: 'استخدم composables بدلاً من mixins أو store مباشر' },
  { warning: 'تجنب استخدام any في TypeScript - استخدم أنواع محددة' },
  { warning: 'تأكد من معالجة الأخطاء (Error handling) في كل API call' },
  { warning: 'أضف loading states لكل عملية async' },
  { warning: 'استخدم دائماً أحدث إصدارات Nuxt & Nuxt UI & Zod' }
]
