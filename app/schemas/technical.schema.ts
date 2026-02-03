import { z } from 'zod'
import type { ProjectType } from '~/types/wizard.types'

const techStackSchema = z.object({
  frontend: z.string().optional(),
  backend: z.string().optional(),
  database: z.string().optional(),
  auth: z.string().optional(),
  runtime: z.string().optional(),
  orm: z.string().optional(),
  fileUpload: z.string().optional(),
  pdfGeneration: z.string().optional(),
  email: z.string().optional(),
  uiLibrary: z.string().optional(),
  port: z.string().optional(),
  frontendPort: z.string().optional()
})

const multiTenancySchema = z.object({
  enabled: z.boolean(),
  model: z.enum(['subdomain', 'path', 'database']).optional(),
  isolationLevel: z.enum(['database', 'schema', 'row']).optional()
}).refine(
  (data) => !data.enabled || (data.model && data.isolationLevel),
  { message: 'حدد نموذج ومستوى العزل عند تفعيل Multi-tenancy' }
)

const externalServiceSchema = z.object({
  name: z.string().min(1, 'اسم الخدمة مطلوب'),
  type: z.enum(['AI', 'Payment', 'Auth', 'Storage', 'Email', 'Analytics', 'Other']),
  apiUrl: z.string().url('أدخل رابط API صحيح').optional().or(z.literal('')),
  description: z.string().min(5, 'أضف وصف للخدمة'),
  envVars: z.array(z.string())
})

export const technicalSchema = z.object({
  techStack: techStackSchema,
  architecture: z.enum(['monolith', 'monorepo', 'microservices']),
  multiTenancy: multiTenancySchema,
  externalServices: z.array(externalServiceSchema).optional()
})

export function createTechnicalSchema(projectType: ProjectType) {
  return technicalSchema.superRefine((data, ctx) => {
    const needsFrontend = ['fullstack', 'frontend-only', 'chrome-extension'].includes(projectType)
    const needsBackend = ['fullstack', 'backend-only'].includes(projectType)
    const needsDatabase = ['fullstack', 'backend-only'].includes(projectType)
    const needsAuth = ['fullstack', 'backend-only', 'frontend-only'].includes(projectType)

    if (needsFrontend && !data.techStack.frontend) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'اختر Frontend framework',
        path: ['techStack', 'frontend']
      })
    }

    if (needsBackend && !data.techStack.backend) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'اختر Backend framework',
        path: ['techStack', 'backend']
      })
    }

    if (needsDatabase && !data.techStack.database) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'اختر Database',
        path: ['techStack', 'database']
      })
    }

    if (needsAuth && !data.techStack.auth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'اختر طريقة المصادقة',
        path: ['techStack', 'auth']
      })
    }
  })
}

export type TechnicalData = z.infer<typeof technicalSchema>

export const frontendOptions = [
  { label: 'Nuxt', value: 'Nuxt' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'Vue.js', value: 'Vue.js' },
  { label: 'React', value: 'React' },
  { label: 'Astro', value: 'Astro' },
  { label: 'Svelte', value: 'Svelte' }
]

export const backendOptions = [
  { label: 'Express.js', value: 'Express.js' },
  { label: 'Fastify', value: 'Fastify' },
  { label: 'NestJS', value: 'NestJS' },
  { label: 'Hono', value: 'Hono' },
  { label: 'Nitro', value: 'Nitro' },
  { label: 'Elysia', value: 'Elysia' }
]

export const databaseOptions = [
  { label: 'None - بدون قاعدة بيانات', value: 'None' },
  { label: 'MySQL', value: 'MySQL' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'SQLite', value: 'SQLite' },
  { label: 'Turso', value: 'Turso' },
  { label: 'Supabase', value: 'Supabase' }
]

export const authOptions = [
  { label: 'None - بدون مصادقة', value: 'None' },
  { label: 'JWT', value: 'JWT' },
  { label: 'Session', value: 'Session' },
  { label: 'OAuth', value: 'OAuth' },
  { label: 'Supabase Auth', value: 'Supabase Auth' },
  { label: 'Auth.js', value: 'Auth.js' },
  { label: 'Clerk', value: 'Clerk' }
]

export const runtimeOptions = [
  { label: 'Node.js', value: 'Node.js' },
  { label: 'Bun', value: 'Bun' },
  { label: 'Deno', value: 'Deno' }
]

export const uiLibraryOptions = [
  { label: 'Nuxt UI (Recommended)', value: 'Nuxt UI' },
  { label: 'Vuetify', value: 'Vuetify' },
  { label: 'PrimeVue', value: 'PrimeVue' },
  { label: 'Headless UI', value: 'Headless UI' },
  { label: 'Shadcn Vue', value: 'Shadcn Vue' },
  { label: 'None', value: 'None' }
]

export const architectureOptions = [
  { label: 'Monolith - تطبيق واحد', value: 'monolith' },
  { label: 'Monorepo - عدة تطبيقات', value: 'monorepo' },
  { label: 'Microservices - خدمات منفصلة', value: 'microservices' }
]

export const tenancyModelOptions = [
  { label: 'Subdomain', value: 'subdomain' },
  { label: 'Path', value: 'path' },
  { label: 'Database per tenant', value: 'database' }
]

export const isolationLevelOptions = [
  { label: 'Database', value: 'database' },
  { label: 'Schema', value: 'schema' },
  { label: 'Row-level', value: 'row' }
]

export const externalServiceTypeOptions = [
  { label: 'AI', value: 'AI', descAr: 'OpenAI, Claude, Gemini, etc.' },
  { label: 'Payment', value: 'Payment', descAr: 'Stripe, PayPal, etc.' },
  { label: 'Auth', value: 'Auth', descAr: 'Auth0, Firebase Auth, etc.' },
  { label: 'Storage', value: 'Storage', descAr: 'S3, Cloudinary, etc.' },
  { label: 'Email', value: 'Email', descAr: 'SendGrid, Resend, etc.' },
  { label: 'Analytics', value: 'Analytics', descAr: 'Google Analytics, Mixpanel, etc.' },
  { label: 'Other', value: 'Other', descAr: 'خدمات أخرى' }
]
