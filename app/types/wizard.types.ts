// Wizard Types

export type ProjectSize = 'small' | 'medium' | 'large'
export type Architecture = 'monolith' | 'monorepo' | 'microservices'
export type ApiStyle = 'REST' | 'GraphQL' | 'tRPC'
export type TenancyModel = 'subdomain' | 'path' | 'database'
export type IsolationLevel = 'database' | 'schema' | 'row'
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'uuid' | 'json' | 'text' | 'decimal'
export type ColumnConstraint = 'primary' | 'unique' | 'nullable' | 'indexed'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type TypeScriptMode = 'config-only' | 'full'

export interface UserStory {
  story: string
}

export interface UserType {
  userType: string
  stories: UserStory[]
}

export interface TechStack {
  frontend: string
  backend: string
  database: string
  auth: string
  orm?: string
  fileUpload?: string
  pdfGeneration?: string
  email?: string
}

export interface MultiTenancy {
  enabled: boolean
  model?: TenancyModel
  isolationLevel?: IsolationLevel
}

export interface Column {
  name: string
  type: ColumnType
  constraints: ColumnConstraint[]
  references?: string
}

export interface Table {
  tableName: string
  description?: string
  columns: Column[]
}

export interface Endpoint {
  method: HttpMethod
  path: string
  description: string
  authRequired: boolean
  body?: string
  response?: string
}

export interface Page {
  path: string
  name: string
  description: string
  auth: boolean
}

export interface EdgeCase {
  scenario: string
  handling: string
}

export interface Phase {
  phaseName: string
  tasks: string[]
}

export interface EnvVariable {
  name: string
  description: string
  required: boolean
  example: string
}

export interface DevelopmentWarning {
  warning: string
}

export interface WizardState {
  // Step 1: Quick Reference & Project Overview
  projectSize: ProjectSize
  projectName: string
  projectNameTechnical: string
  problemStatement: string
  solutionDescription: string
  targetUsers: string
  targetUserType: string
  targetUserLevel: string
  primaryLanguage: string

  // Step 2: User Stories
  userTypes: UserType[]

  // Step 3: Technical Requirements
  techStack: TechStack
  architecture: Architecture
  multiTenancy: MultiTenancy

  // Step 4: Database Design
  tables: Table[]
  relationships: string

  // Step 5: API Design
  apiStyle: ApiStyle
  routePrefix: string
  endpoints: Endpoint[]

  // Step 6: Frontend Pages
  pages: Page[]
  sharedComponents: string

  // Step 7: Features & Implementation
  mvpFeatures: string[]
  futureFeatures: string[]
  wireframes: string
  edgeCases: EdgeCase[]
  implementationPhases: Phase[]

  // Step 8: Dependencies & Environment
  backendDependencies: string[]
  frontendDependencies: string[]
  environmentVariables: EnvVariable[]
  seedData: string

  // Step 9: Development Guidelines
  useTypeScript: TypeScriptMode
  developmentWarnings: DevelopmentWarning[]
}

export interface WizardStep {
  id: number
  title: string
  titleAr: string
  icon: string
  description?: string
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 0, title: 'Overview', titleAr: 'نظرة عامة', icon: 'i-lucide-rocket' },
  { id: 1, title: 'User Stories', titleAr: 'قصص المستخدم', icon: 'i-lucide-users' },
  { id: 2, title: 'Technical', titleAr: 'التقنيات', icon: 'i-lucide-settings' },
  { id: 3, title: 'Database', titleAr: 'قاعدة البيانات', icon: 'i-lucide-database' },
  { id: 4, title: 'API', titleAr: 'الـ API', icon: 'i-lucide-network' },
  { id: 5, title: 'Frontend', titleAr: 'الواجهة', icon: 'i-lucide-layout' },
  { id: 6, title: 'Features', titleAr: 'المميزات', icon: 'i-lucide-list-checks' },
  { id: 7, title: 'Dependencies', titleAr: 'المتطلبات', icon: 'i-lucide-package' },
  { id: 8, title: 'Guidelines', titleAr: 'إرشادات التطوير', icon: 'i-lucide-shield-check' }
]

export const initialWizardState: WizardState = {
  // Step 1
  projectSize: 'medium',
  projectName: '',
  projectNameTechnical: '',
  problemStatement: '',
  solutionDescription: '',
  targetUsers: '',
  targetUserType: 'both',
  targetUserLevel: 'beginner',
  primaryLanguage: 'ar',

  // Step 2
  userTypes: [{ userType: '', stories: [{ story: '' }] }],

  // Step 3
  techStack: {
    frontend: 'Nuxt 4',
    backend: 'Express.js',
    database: 'MySQL',
    auth: 'JWT'
  },
  architecture: 'monolith',
  multiTenancy: {
    enabled: false
  },

  // Step 4
  tables: [{
    tableName: 'users',
    description: 'جدول المستخدمين',
    columns: [
      { name: 'id', type: 'number', constraints: ['primary'] },
      { name: 'name', type: 'string', constraints: [] },
      { name: 'email', type: 'string', constraints: ['unique'] },
      { name: 'password', type: 'string', constraints: [] },
      { name: 'created_at', type: 'date', constraints: [] }
    ]
  }],
  relationships: '',

  // Step 5
  apiStyle: 'REST',
  routePrefix: '/api',
  endpoints: [],

  // Step 6
  pages: [],
  sharedComponents: '',

  // Step 7
  mvpFeatures: [],
  futureFeatures: [],
  wireframes: '',
  edgeCases: [],
  implementationPhases: [],

  // Step 8
  backendDependencies: ['express', 'mysql2', 'jsonwebtoken', 'bcryptjs', 'zod', 'cors', 'dotenv'],
  frontendDependencies: ['nuxt', '@nuxt/ui', '@sidebase/nuxt-auth', '@pinia/nuxt'],
  environmentVariables: [
    { name: 'PORT', description: 'Server port', required: true, example: '3001' },
    { name: 'DB_HOST', description: 'Database host', required: true, example: 'localhost' },
    { name: 'DB_NAME', description: 'Database name', required: true, example: 'myapp_db' },
    { name: 'JWT_SECRET', description: 'JWT secret key', required: true, example: 'your-secret-key' }
  ],
  seedData: '',

  // Step 9: Development Guidelines
  useTypeScript: 'config-only',
  developmentWarnings: [
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
}
