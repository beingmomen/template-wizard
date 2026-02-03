import { z } from 'zod'
import type { WizardState } from '~/types/wizard.types'
import { needsBackend, needsFrontend, needsEnvVars } from '~/utils/projectCapabilities'

const envVariableSchema = z.object({
  name: z.string().min(1, 'اسم المتغير مطلوب').regex(/^[A-Z_][A-Z0-9_]*$/, 'استخدم حروف كبيرة وشرطات سفلية فقط'),
  description: z.string().min(5, 'الوصف مطلوب'),
  required: z.boolean(),
  example: z.string().min(1, 'المثال مطلوب')
})

const PYTHON_PACKAGES = ['numpy', 'pandas', 'flask', 'django', 'fastapi', 'torch', 'tensorflow',
  'scikit-learn', 'matplotlib', 'scipy', 'requests', 'beautifulsoup4', 'celery', 'pillow',
  'opencv-python', 'transformers', 'langchain', 'whisper', 'pytest', 'pip']

const PHP_PACKAGES = ['laravel', 'symfony', 'composer', 'artisan', 'eloquent', 'blade', 'phpunit']

const RUST_PACKAGES = ['tokio', 'serde', 'cargo', 'actix', 'reqwest', 'clap']

function isNonJsPackage(name: string): boolean {
  const lower = name.toLowerCase()
  return PYTHON_PACKAGES.includes(lower) || PHP_PACKAGES.includes(lower) || RUST_PACKAGES.includes(lower)
}

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
  aiDependencies: z.array(z.string()).optional(),
  systemDependencies: z.array(z.string()).optional(),
  buildDependencies: z.array(z.string()).optional(),
  environmentVariables: z.array(envVariableSchema).min(1, 'أضف متغير واحد على الأقل'),
  seedData: z.string().optional()
})

export function createDependenciesSchema(state: WizardState) {
  const _needsBackend = needsBackend(state)
  const _needsFrontend = needsFrontend(state)
  const _needsEnvVars = needsEnvVars(state)

  return z.object({
    packageManager: z.enum(['pnpm', 'npm', 'yarn', 'bun']).optional().default('pnpm'),
    backendDependencies: _needsBackend
      ? z.array(z.string().min(1)).min(1, 'أضف مكتبة واحدة على الأقل').refine(
          deps => !deps.some(d => isNonJsPackage(d)),
          { message: 'تم العثور على حزم من نظام بيئي مختلف (Python/PHP/Rust) في تبعيات JavaScript' }
        )
      : z.array(z.string()).optional(),
    frontendDependencies: _needsFrontend
      ? z.array(z.string().min(1)).min(1, 'أضف مكتبة واحدة على الأقل').refine(
          deps => !deps.some(d => isNonJsPackage(d)),
          { message: 'تم العثور على حزم من نظام بيئي مختلف (Python/PHP/Rust) في تبعيات JavaScript' }
        )
      : z.array(z.string()).optional(),
    aiDependencies: z.array(z.string()).optional(),
    systemDependencies: z.array(z.string()).optional(),
    buildDependencies: z.array(z.string()).optional(),
    environmentVariables: _needsEnvVars
      ? z.array(envVariableSchema).min(1, 'أضف متغير واحد على الأقل')
      : z.array(envVariableSchema).optional(),
    seedData: z.string().optional()
  })
}

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

export const commonAiDeps = [
  'openai',
  '@anthropic-ai/sdk',
  '@google/generative-ai',
  'langchain',
  'ollama',
  'transformers',
  'onnxruntime-node',
  'whisper-node'
]

export const commonSystemDeps = [
  '@tauri-apps/api',
  '@tauri-apps/cli',
  'electron',
  'node-pty',
  'node-hid',
  'systeminformation',
  'robotjs'
]

export const commonBuildDeps = [
  'vite',
  'esbuild',
  'rollup',
  'webpack',
  'tsup',
  'unbuild',
  'pkg'
]
