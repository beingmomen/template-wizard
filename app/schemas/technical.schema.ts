import { z } from 'zod'

const techStackSchema = z.object({
  frontend: z.string().min(1, 'اختر Frontend framework'),
  backend: z.string().min(1, 'اختر Backend framework'),
  database: z.string().min(1, 'اختر Database'),
  auth: z.string().min(1, 'اختر طريقة المصادقة'),
  orm: z.string().optional(),
  fileUpload: z.string().optional(),
  pdfGeneration: z.string().optional(),
  email: z.string().optional()
})

const multiTenancySchema = z.object({
  enabled: z.boolean(),
  model: z.enum(['subdomain', 'path', 'database']).optional(),
  isolationLevel: z.enum(['database', 'schema', 'row']).optional()
}).refine(
  (data) => !data.enabled || (data.model && data.isolationLevel),
  { message: 'حدد نموذج ومستوى العزل عند تفعيل Multi-tenancy' }
)

export const technicalSchema = z.object({
  techStack: techStackSchema,
  architecture: z.enum(['monolith', 'monorepo', 'microservices']),
  multiTenancy: multiTenancySchema
})

export type TechnicalData = z.infer<typeof technicalSchema>

// Options for select menus
export const frontendOptions = [
  { label: 'Nuxt 4', value: 'Nuxt 4' },
  { label: 'Nuxt 3', value: 'Nuxt 3' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'Vue.js', value: 'Vue.js' },
  { label: 'React', value: 'React' },
  { label: 'Astro', value: 'Astro' }
]

export const backendOptions = [
  { label: 'Express.js', value: 'Express.js' },
  { label: 'Fastify', value: 'Fastify' },
  { label: 'NestJS', value: 'NestJS' },
  { label: 'Hono', value: 'Hono' },
  { label: 'Nitro', value: 'Nitro' }
]

export const databaseOptions = [
  { label: 'MySQL', value: 'MySQL' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'SQLite', value: 'SQLite' },
  { label: 'Turso', value: 'Turso' }
]

export const authOptions = [
  { label: 'JWT', value: 'JWT' },
  { label: 'Session', value: 'Session' },
  { label: 'OAuth', value: 'OAuth' },
  { label: 'Supabase Auth', value: 'Supabase Auth' },
  { label: 'Auth.js', value: 'Auth.js' }
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
