import { z } from 'zod'

const envVariableSchema = z.object({
  name: z.string().min(1, 'اسم المتغير مطلوب').regex(/^[A-Z_][A-Z0-9_]*$/, 'استخدم حروف كبيرة وشرطات سفلية فقط'),
  description: z.string().min(5, 'الوصف مطلوب'),
  required: z.boolean(),
  example: z.string().min(1, 'المثال مطلوب')
})

export const packageManagerOptions = [
  { label: 'pnpm (Recommended)', value: 'pnpm' },
  { label: 'npm', value: 'npm' },
  { label: 'yarn', value: 'yarn' },
  { label: 'bun', value: 'bun' }
]

export const dependenciesSchema = z.object({
  packageManager: z.enum(['pnpm', 'npm', 'yarn', 'bun']).optional().default('pnpm'),
  backendDependencies: z.array(z.string().min(1)).min(1, 'أضف مكتبة واحدة على الأقل'),
  frontendDependencies: z.array(z.string().min(1)).min(1, 'أضف مكتبة واحدة على الأقل'),
  environmentVariables: z.array(envVariableSchema).min(1, 'أضف متغير واحد على الأقل'),
  seedData: z.string().optional()
})

export type DependenciesData = z.infer<typeof dependenciesSchema>

// Common dependencies
export const commonBackendDeps = [
  'express',
  'fastify',
  'mysql2',
  'pg',
  'mongoose',
  'jsonwebtoken',
  'bcryptjs',
  'zod',
  'cors',
  'dotenv',
  'cookie-parser',
  'puppeteer',
  'multer',
  'nodemailer'
]

export const commonFrontendDeps = [
  'nuxt',
  '@nuxt/ui',
  '@sidebase/nuxt-auth',
  '@pinia/nuxt',
  'pinia',
  '@vueuse/nuxt',
  '@nuxt/image'
]
