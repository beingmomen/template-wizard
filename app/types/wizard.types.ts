// Wizard Types

export type ProjectType =
  | 'fullstack'
  | 'frontend-only'
  | 'backend-only'
  | 'chrome-extension'
  | 'cli-tool'
  | 'library'
  | 'integration'

export type ProjectSize = 'small' | 'medium' | 'large'
export type Architecture = 'monolith' | 'monorepo' | 'microservices'
export type ApiStyle = 'REST' | 'GraphQL' | 'tRPC'
export type TenancyModel = 'subdomain' | 'path' | 'database'
export type IsolationLevel = 'database' | 'schema' | 'row'
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'uuid' | 'json' | 'text' | 'decimal'
export type ColumnConstraint = 'primary' | 'unique' | 'nullable' | 'notNull' | 'indexed' | 'autoIncrement' | 'foreignKey' | 'default'
export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type TypeScriptMode = 'config-only' | 'full'
export type ProjectStatus = 'planning' | 'planned' | 'completed'
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'custom'
export type PermissionSystemType = 'role-based' | 'action-based' | 'resource-based' | 'custom'
export type ExternalServiceType = 'AI' | 'Payment' | 'Auth' | 'Storage' | 'Email' | 'Analytics' | 'Other'

export interface Permission {
  id: string
  name: string
  resource: string
  action: PermissionAction
  description?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  inheritsFrom?: string
}

export interface PermissionsConfig {
  enabled: boolean
  type: PermissionSystemType
  superAdminRole?: string
  defaultRole?: string
}

export interface ExternalService {
  name: string
  type: ExternalServiceType
  apiUrl?: string
  description: string
  envVars: string[]
}

export interface UserStory {
  story: string
}

export interface UserType {
  userType: string
  stories: UserStory[]
  roleId?: string
}

export interface TechStack {
  frontend?: string
  backend?: string
  database?: string
  auth?: string
  runtime?: string
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

export interface ForeignKey {
  relatedTable: string
  relationshipType: RelationshipType
}

export interface Column {
  name: string
  type: ColumnType
  constraints: ColumnConstraint[]
  foreignKey?: ForeignKey
  defaultValue?: string
}

export interface Table {
  tableName: string
  description?: string
  columns: Column[]
}

export type QueryParamType = 'string' | 'number' | 'boolean' | 'array'

export interface QueryParameter {
  name: string
  type: QueryParamType
  required: boolean
  description?: string
  example?: string
}

export interface Endpoint {
  method: HttpMethod
  path: string
  description: string
  authRequired: boolean
  requiredPermissions?: string[]
  queryParameters?: QueryParameter[]
  body?: string
  response?: string
}

export interface ApiGroup {
  name: string
  basePath: string
  description: string
  endpoints: Endpoint[]
}

export interface Page {
  path: string
  name: string
  description: string
  auth: boolean
  requiredPermissions?: string[]
  requiredRoles?: string[]
}

export interface FrontendModule {
  name: string
  basePath: string
  description: string
  pages: Page[]
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
  projectType: ProjectType
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

  // Step 3: Permissions & Roles
  permissionsConfig: PermissionsConfig
  permissions: Permission[]
  roles: Role[]

  // Step 4: Technical Requirements
  techStack: TechStack
  architecture: Architecture
  multiTenancy: MultiTenancy
  externalServices: ExternalService[]

  // Step 5: Database Design
  tables: Table[]
  relationships: string

  // Step 6: API Design
  apiStyle: ApiStyle
  routePrefix: string
  endpoints: Endpoint[]
  apiGroups: ApiGroup[]

  // Step 7: Frontend Pages
  pages: Page[]
  frontendModules: FrontendModule[]
  sharedComponents: string

  // Step 8: Features & Implementation
  mvpFeatures: string[]
  futureFeatures: string[]
  wireframes: string
  edgeCases: EdgeCase[]
  implementationPhases: Phase[]

  // Step 9: Dependencies & Environment
  backendDependencies: string[]
  frontendDependencies: string[]
  environmentVariables: EnvVariable[]
  seedData: string

  // Step 10: Development Guidelines
  useTypeScript: TypeScriptMode
  developmentWarnings: DevelopmentWarning[]

  // Project Status
  projectStatus: ProjectStatus
  deletedAt?: string | null
}

export interface WizardStep {
  id: number
  title: string
  titleAr: string
  icon: string
  description?: string
  visibleFor?: ProjectType[]
}

export const ALL_PROJECT_TYPES: ProjectType[] = [
  'fullstack', 'frontend-only', 'backend-only', 'chrome-extension', 'cli-tool', 'library', 'integration'
]

export const WIZARD_STEPS: WizardStep[] = [
  { id: 0, title: 'Overview', titleAr: 'نظرة عامة', icon: 'i-lucide-rocket' },
  { id: 1, title: 'User Stories', titleAr: 'قصص المستخدم', icon: 'i-lucide-users' },
  { id: 2, title: 'Permissions', titleAr: 'الصلاحيات', icon: 'i-lucide-shield', visibleFor: ['fullstack', 'backend-only'] },
  { id: 3, title: 'Technical', titleAr: 'التقنيات', icon: 'i-lucide-settings' },
  { id: 4, title: 'Summary', titleAr: 'ملخص للمناقشة', icon: 'i-lucide-file-text' },
  { id: 5, title: 'Database', titleAr: 'قاعدة البيانات', icon: 'i-lucide-database', visibleFor: ['fullstack', 'backend-only', 'cli-tool', 'integration'] },
  { id: 6, title: 'Summary 2', titleAr: 'ملخص مع قاعدة البيانات', icon: 'i-lucide-file-text', visibleFor: ['fullstack', 'backend-only', 'cli-tool', 'integration'] },
  { id: 7, title: 'API', titleAr: 'الـ API', icon: 'i-lucide-network', visibleFor: ['fullstack', 'backend-only', 'library', 'integration'] },
  { id: 8, title: 'Frontend', titleAr: 'الواجهة', icon: 'i-lucide-layout', visibleFor: ['fullstack', 'frontend-only', 'chrome-extension', 'integration'] },
  { id: 9, title: 'Features', titleAr: 'المميزات', icon: 'i-lucide-list-checks' },
  { id: 10, title: 'Dependencies', titleAr: 'المتطلبات', icon: 'i-lucide-package' },
  { id: 11, title: 'Guidelines', titleAr: 'إرشادات التطوير', icon: 'i-lucide-shield-check' }
]

export const initialWizardState: WizardState = {
  // Step 1
  projectType: 'fullstack',
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

  // Step 3: Permissions
  permissionsConfig: {
    enabled: false,
    type: 'role-based'
  },
  permissions: [],
  roles: [],

  // Step 4: Technical
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
  externalServices: [],

  // Step 5: Database
  tables: [{
    tableName: 'users',
    description: 'جدول المستخدمين',
    columns: [
      { name: 'id', type: 'number', constraints: ['primary', 'autoIncrement'] },
      { name: 'name', type: 'string', constraints: ['notNull'] },
      { name: 'email', type: 'string', constraints: ['unique', 'notNull'] },
      { name: 'password', type: 'string', constraints: ['notNull'] },
      { name: 'created_at', type: 'date', constraints: [] }
    ]
  }],
  relationships: '',

  // Step 5
  apiStyle: 'REST',
  routePrefix: '/api',
  endpoints: [],
  apiGroups: [],

  // Step 6
  pages: [],
  frontendModules: [],
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
  ],

  // Project Status
  projectStatus: 'planning'
}
