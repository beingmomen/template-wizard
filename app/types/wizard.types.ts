// Wizard Types

export type ProjectType
  = | 'fullstack'
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
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'
export type FrontendMode = 'template' | 'custom'
export type ModuleType = 'none' | 'index-only' | 'crud-modal' | 'index-add-edit' | 'full-crud' | 'view-edit-combined'
export type PaginationType = 'backend' | 'frontend' | 'none'

export type ProjectNature = 'product' | 'tool' | 'library' | 'service' | 'automation'
export type RuntimeTarget = 'web' | 'desktop' | 'mobile' | 'cli' | 'system'
export type IntelligenceLevel = 'none' | 'rules-based' | 'ai-assisted' | 'ai-core'
export type CommunicationInterface = 'http-api' | 'local-ipc' | 'tauri-commands' | 'cli-flags' | 'file-based'
export type HardwarePreference = 'gpu-preferred' | 'cpu-only' | 'any'

export type SharedComponentCategory = 'layout' | 'data' | 'feedback' | 'form' | 'navigation' | 'utility'

export interface SharedComponent {
  name: string
  description: string
  category: SharedComponentCategory
}

export const COMPONENT_CATEGORY_LABELS: Record<SharedComponentCategory, string> = {
  layout: 'التخطيط',
  data: 'عرض البيانات',
  feedback: 'ردود الفعل',
  form: 'النماذج',
  navigation: 'التنقل',
  utility: 'أدوات مساعدة'
}

export const MODULE_TYPE_OPTIONS: { value: ModuleType, label: string, description: string }[] = [
  { value: 'none', label: 'بدون نوع', description: 'صفحة فارغة بدون بنية محددة' },
  { value: 'index-only', label: 'قائمة فقط', description: 'صفحة عرض البيانات فقط (للقراءة)' },
  { value: 'crud-modal', label: 'CRUD عبر Modal', description: 'صفحة واحدة مع عمليات CRUD عبر نوافذ منبثقة' },
  { value: 'index-add-edit', label: 'قائمة + نموذج', description: 'صفحة قائمة + صفحة نموذج مشتركة للإضافة والتعديل' },
  { value: 'full-crud', label: 'CRUD كامل', description: 'صفحات منفصلة: قائمة + إضافة + تعديل + مشاهدة' },
  { value: 'view-edit-combined', label: 'مشاهدة وتعديل معاً', description: 'قائمة + إضافة + صفحة مشتركة للمشاهدة والتعديل' }
]

export const PAGINATION_TYPE_OPTIONS: { value: PaginationType, label: string, description: string }[] = [
  { value: 'backend', label: 'ترقيم من الخادم', description: 'Backend pagination' },
  { value: 'frontend', label: 'ترقيم في الواجهة', description: 'Frontend pagination (كل البيانات محملة)' },
  { value: 'none', label: 'بدون ترقيم', description: 'لا يوجد جدول أو ترقيم في هذه الصفحة' }
]

export const COMMON_SHARED_COMPONENTS: SharedComponent[] = [
  { name: 'AppHeader', description: 'الهيدر الرئيسي مع الشعار وقائمة التنقل', category: 'layout' },
  { name: 'AppSidebar', description: 'القائمة الجانبية للتنقل', category: 'layout' },
  { name: 'AppFooter', description: 'الفوتر مع روابط سريعة ومعلومات', category: 'layout' },
  { name: 'AppLogo', description: 'شعار التطبيق', category: 'layout' },
  { name: 'PageHeader', description: 'عنوان الصفحة مع breadcrumb', category: 'layout' },

  { name: 'DataTable', description: 'جدول بيانات مع فرز وفلترة وترقيم', category: 'data' },
  { name: 'StatCard', description: 'بطاقة إحصائيات للداشبورد', category: 'data' },
  { name: 'UserAvatar', description: 'صورة المستخدم مع fallback', category: 'data' },
  { name: 'StatusBadge', description: 'شارة حالة ملونة', category: 'data' },
  { name: 'PriceDisplay', description: 'عرض السعر مع العملة', category: 'data' },
  { name: 'InfoCard', description: 'بطاقة معلومات عامة', category: 'data' },
  { name: 'Timeline', description: 'عرض الأحداث بشكل زمني', category: 'data' },

  { name: 'ConfirmModal', description: 'نافذة تأكيد للعمليات الخطرة', category: 'feedback' },
  { name: 'DeleteDialog', description: 'نافذة تأكيد الحذف', category: 'feedback' },
  { name: 'ToastNotification', description: 'إشعارات منبثقة', category: 'feedback' },
  { name: 'AlertBanner', description: 'شريط تنبيهات علوي', category: 'feedback' },
  { name: 'SuccessMessage', description: 'رسالة نجاح العملية', category: 'feedback' },

  { name: 'FormField', description: 'حقل إدخال موحد مع validation', category: 'form' },
  { name: 'FileUploader', description: 'رفع الملفات مع preview', category: 'form' },
  { name: 'ImageUploader', description: 'رفع الصور مع crop', category: 'form' },
  { name: 'SearchInput', description: 'حقل البحث مع debounce', category: 'form' },
  { name: 'DatePicker', description: 'اختيار التاريخ', category: 'form' },
  { name: 'RichTextEditor', description: 'محرر نصوص غني', category: 'form' },
  { name: 'TagInput', description: 'إدخال الوسوم المتعددة', category: 'form' },
  { name: 'ColorPicker', description: 'اختيار الألوان', category: 'form' },

  { name: 'Breadcrumb', description: 'مسار التنقل', category: 'navigation' },
  { name: 'Pagination', description: 'أزرار ترقيم الصفحات', category: 'navigation' },
  { name: 'TabsNav', description: 'تنقل بالتبويبات', category: 'navigation' },
  { name: 'StepWizard', description: 'خطوات معالج متعددة', category: 'navigation' },
  { name: 'BackButton', description: 'زر العودة للصفحة السابقة', category: 'navigation' },

  { name: 'LoadingSpinner', description: 'مؤشر التحميل الدائري', category: 'utility' },
  { name: 'LoadingSkeleton', description: 'هيكل تحميل للبطاقات', category: 'utility' },
  { name: 'EmptyState', description: 'حالة عدم وجود بيانات', category: 'utility' },
  { name: 'ErrorState', description: 'حالة الخطأ مع إعادة المحاولة', category: 'utility' },
  { name: 'NoPermission', description: 'صفحة عدم وجود صلاحية', category: 'utility' },
  { name: 'NotFound', description: 'صفحة 404', category: 'utility' },
  { name: 'OfflineIndicator', description: 'مؤشر عدم الاتصال', category: 'utility' }
]

export interface NuxtUiTemplate {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  framework: 'nuxt' | 'vue'
  features: string[]
  previewUrl: string
  githubUrl: string
}

export const NUXT_UI_TEMPLATES: NuxtUiTemplate[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    nameAr: 'لوحة تحكم',
    description: 'Multi-column admin dashboard interface',
    descriptionAr: 'لوحة تحكم إدارية متعددة الأعمدة',
    icon: 'i-lucide-bar-chart-big',
    framework: 'nuxt',
    features: ['Works with SaaS template', 'Charts and date pickers', 'Multi-column layout'],
    previewUrl: 'https://dashboard-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/dashboard'
  },
  {
    id: 'saas',
    name: 'SaaS',
    nameAr: 'تطبيق SaaS',
    description: 'Landing, pricing, docs, blog and auth pages',
    descriptionAr: 'صفحات هبوط، أسعار، توثيق، مدونة ومصادقة',
    icon: 'i-lucide-cloud',
    framework: 'nuxt',
    features: ['Landing, pricing, docs & blog sections', 'Authentication pages', 'YAML content'],
    previewUrl: 'https://saas-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/saas'
  },
  {
    id: 'landing',
    name: 'Landing',
    nameAr: 'صفحة هبوط',
    description: 'Modern landing page with features, pricing, testimonials',
    descriptionAr: 'صفحة هبوط حديثة مع مميزات وأسعار وآراء العملاء',
    icon: 'i-lucide-layout',
    framework: 'nuxt',
    features: ['Features, pricing, testimonials & FAQ', 'YAML content', 'Fully responsive'],
    previewUrl: 'https://landing-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/landing'
  },
  {
    id: 'docs',
    name: 'Docs',
    nameAr: 'توثيق',
    description: 'Documentation site with markdown and full-text search',
    descriptionAr: 'موقع توثيق مع Markdown وبحث نصي كامل',
    icon: 'i-lucide-book',
    framework: 'nuxt',
    features: ['Markdown pages', 'Auto-generated navigation', 'Full-text search'],
    previewUrl: 'https://docs-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/docs'
  },
  {
    id: 'chat',
    name: 'Chat',
    nameAr: 'محادثة ذكية',
    description: 'AI chatbot with auth and persistent history',
    descriptionAr: 'شات بوت ذكي مع مصادقة وسجل محادثات',
    icon: 'i-lucide-message-circle',
    framework: 'nuxt',
    features: ['GitHub authentication', 'Persistent chat history', 'Markdown syntax highlight'],
    previewUrl: 'https://chat-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/chat'
  },
  {
    id: 'editor',
    name: 'Editor',
    nameAr: 'محرر نصوص',
    description: 'Rich text editor with TipTap and real-time collaboration',
    descriptionAr: 'محرر نصوص غني مبني على TipTap مع تعاون فوري',
    icon: 'i-lucide-file-text',
    framework: 'nuxt',
    features: ['Real-time collaboration', 'AI autocompletion', 'Suggestions, mentions & emojis'],
    previewUrl: 'https://editor-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/editor'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    nameAr: 'معرض أعمال',
    description: 'Portfolio to showcase work, skills and blog',
    descriptionAr: 'معرض أعمال لعرض المشاريع والمهارات والمدونة',
    icon: 'i-lucide-user',
    framework: 'nuxt',
    features: ['Projects, blog, speaking & about sections', 'Markdown & YAML content', 'Fully responsive'],
    previewUrl: 'https://portfolio-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/portfolio'
  },
  {
    id: 'changelog',
    name: 'Changelog',
    nameAr: 'سجل التغييرات',
    description: 'Display GitHub release notes',
    descriptionAr: 'عرض سجل التغييرات من GitHub',
    icon: 'i-lucide-newspaper',
    framework: 'nuxt',
    features: ['GitHub API integration', 'Beautiful typography', 'Dark mode ready'],
    previewUrl: 'https://changelog-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/changelog'
  },
  {
    id: 'starter',
    name: 'Starter',
    nameAr: 'قالب بداية',
    description: 'Minimal starter template with Nuxt and ESLint',
    descriptionAr: 'قالب بداية بسيط مع Nuxt و ESLint',
    icon: 'i-lucide-flower',
    framework: 'nuxt',
    features: ['Nuxt configured', 'ESLint configured'],
    previewUrl: 'https://starter-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/starter'
  },
  {
    id: 'dashboard-vue',
    name: 'Dashboard (Vue)',
    nameAr: 'لوحة تحكم (Vue)',
    description: 'Multi-column dashboard for Vue apps',
    descriptionAr: 'لوحة تحكم متعددة الأعمدة لتطبيقات Vue',
    icon: 'i-lucide-bar-chart-big',
    framework: 'vue',
    features: ['Charts and date pickers', 'Multi-column layout'],
    previewUrl: 'https://dashboard-vue-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/dashboard-vue'
  },
  {
    id: 'starter-vue',
    name: 'Starter (Vue)',
    nameAr: 'قالب بداية (Vue)',
    description: 'Minimal Vue starter with Vite and ESLint',
    descriptionAr: 'قالب بداية بسيط لـ Vue مع Vite و ESLint',
    icon: 'i-lucide-flower',
    framework: 'vue',
    features: ['Vite configured', 'ESLint configured'],
    previewUrl: 'https://starter-vue-template.nuxt.dev',
    githubUrl: 'https://github.com/nuxt-ui-templates/starter-vue'
  }
]

export interface AIModel {
  name: string
  isOpenSource: boolean
  isAPI: boolean
  offlineSupport: boolean
}

export interface AIConfiguration {
  domains: string[]
  models: AIModel[]
  supportedLanguages: string[]
  hardwarePreference: HardwarePreference
}

export interface DesktopSystemCapabilities {
  fileSystemAccess: boolean
  microphone: boolean
  camera: boolean
  globalShortcuts: boolean
  backgroundExecution: boolean
  autoStart: boolean
}

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
  uiLibrary?: string
  port?: string
  frontendPort?: string
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
  moduleType?: ModuleType
  paginationType?: PaginationType
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
  enabled: boolean
  isDefault?: boolean
}

export type MCPServerCategory = 'framework' | 'ui' | 'testing' | 'database' | 'api' | 'other'

export interface MCPServer {
  id: string
  name: string
  type: 'http' | 'stdio'
  url?: string
  command?: string
  args?: string[]
  description: string
  descriptionAr: string
  relatedTechnologies: string[]
  category: MCPServerCategory
  checkInstructions: string
}

export const AVAILABLE_MCP_SERVERS: MCPServer[] = [
  {
    id: 'nuxt-remote',
    name: 'Nuxt MCP Server',
    type: 'http',
    url: 'https://nuxt.com/mcp',
    description: 'Official Nuxt documentation and guidance',
    descriptionAr: 'وثائق وإرشادات Nuxt الرسمية',
    relatedTechnologies: ['Nuxt'],
    category: 'framework',
    checkInstructions: `⛔ BLOCKING: Before creating ANY Nuxt file (page, component, composable, middleware, plugin), you MUST call:
- \`mcp__nuxt-remote__get-documentation-page\` to verify file conventions
- \`mcp__nuxt-remote__list-modules\` when adding any module
Do NOT assume folder structure or file naming from memory.`
  },
  {
    id: 'nuxt-ui-remote',
    name: 'Nuxt UI MCP Server',
    type: 'http',
    url: 'https://ui.nuxt.com/mcp',
    description: 'Nuxt UI component documentation',
    descriptionAr: 'وثائق مكونات Nuxt UI',
    relatedTechnologies: ['Nuxt UI'],
    category: 'ui',
    checkInstructions: `⛔ BLOCKING: Before writing ANY <U...> component tag, you MUST call:
- \`mcp__nuxt-ui-remote__get-component\` to get the component documentation
- \`mcp__nuxt-ui-remote__get-component-metadata\` to verify props, slots, and events
Writing a Nuxt UI component WITHOUT calling these tools first makes your code INVALID.
Do NOT rely on training data — component APIs change between versions.`
  },
  {
    id: 'playwright',
    name: 'Playwright MCP Server',
    type: 'stdio',
    command: 'cmd',
    args: ['/c', 'npx', '@playwright/mcp@latest'],
    description: 'Playwright browser automation for testing',
    descriptionAr: 'أتمتة المتصفح للاختبار باستخدام Playwright',
    relatedTechnologies: ['Playwright', 'Testing'],
    category: 'testing',
    checkInstructions: 'Use Playwright MCP for browser automation and E2E testing'
  },
  {
    id: 'github',
    name: 'GitHub MCP Server',
    type: 'stdio',
    command: 'gh',
    args: [],
    description: 'GitHub CLI integration',
    descriptionAr: 'تكامل GitHub CLI',
    relatedTechnologies: ['GitHub'],
    category: 'other',
    checkInstructions: 'Use GitHub CLI for repository management and CI/CD'
  }
]

export const TECH_TO_MCP_MAP: Record<string, string[]> = {
  'Nuxt': ['nuxt-remote'],
  'Nuxt 4': ['nuxt-remote'],
  'Nuxt 3': ['nuxt-remote'],
  'Nuxt UI': ['nuxt-ui-remote'],
  'Vuetify': [],
  'PrimeVue': [],
  'Headless UI': [],
  'Shadcn Vue': [],
  'Playwright': ['playwright'],
  'Testing': ['playwright'],
  'GitHub': ['github']
}

export interface WizardState {
  // Step 1: Quick Reference & Project Overview
  projectType: ProjectType
  projectNature: ProjectNature
  runtimeTargets: RuntimeTarget[]
  intelligenceLevel: IntelligenceLevel
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
  techVersions: Record<string, string>
  architecture: Architecture
  multiTenancy: MultiTenancy
  externalServices: ExternalService[]

  // Step 5: Database Design
  tables: Table[]
  relationships: string

  // Step 6: API Design
  apiStyle: ApiStyle
  routePrefix: string
  communicationInterfaces: CommunicationInterface[]
  endpoints: Endpoint[]
  apiGroups: ApiGroup[]

  // Step 7: Frontend Pages
  frontendMode: FrontendMode
  selectedTemplate: string | null
  pages: Page[]
  frontendModules: FrontendModule[]
  sharedComponents: SharedComponent[]

  // Step 8: Features & Implementation
  mvpFeatures: string[]
  futureFeatures: string[]
  wireframes: string
  edgeCases: EdgeCase[]
  implementationPhases: Phase[]

  // AI Configuration
  aiConfiguration: AIConfiguration
  desktopSystemCapabilities: DesktopSystemCapabilities

  // Step 9: Dependencies & Environment
  packageManager: PackageManager
  backendDependencies: string[]
  frontendDependencies: string[]
  aiDependencies: string[]
  systemDependencies: string[]
  buildDependencies: string[]
  environmentVariables: EnvVariable[]
  seedData: string

  // Step 10: Development Guidelines
  useTypeScript: TypeScriptMode
  developmentWarnings: DevelopmentWarning[]

  // MCP Servers Configuration
  selectedMcpServers: string[]
  includeMcpJson: boolean

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
  contextHint?: string
  visibleWhen?: (state: WizardState) => boolean
}

export const ALL_PROJECT_TYPES: ProjectType[] = [
  'fullstack', 'frontend-only', 'backend-only', 'chrome-extension', 'cli-tool', 'library', 'integration'
]

export const WIZARD_STEPS: WizardStep[] = [
  { id: 0, title: 'Overview', titleAr: 'نظرة عامة', icon: 'i-lucide-rocket' },
  { id: 1, title: 'User Stories', titleAr: 'قصص المستخدم', icon: 'i-lucide-users' },
  { id: 2, title: 'Permissions', titleAr: 'الصلاحيات', icon: 'i-lucide-shield', contextHint: 'ظهرت هذه الخطوة لأن نوع المشروع يتضمن Backend', visibleWhen: s => ['fullstack', 'backend-only'].includes(s.projectType) },
  { id: 3, title: 'Technical', titleAr: 'التقنيات', icon: 'i-lucide-settings' },
  { id: 12, title: 'AI Configuration', titleAr: 'إعدادات الذكاء الاصطناعي', icon: 'i-lucide-brain', contextHint: 'ظهرت هذه الخطوة لأنك اخترت مستوى ذكاء اصطناعي غير «بدون ذكاء»', visibleWhen: s => s.intelligenceLevel !== 'none' },
  { id: 13, title: 'Desktop/System', titleAr: 'سطح المكتب والنظام', icon: 'i-lucide-monitor', contextHint: 'ظهرت هذه الخطوة لأنك اخترت «سطح المكتب» أو «نظام» كبيئة تشغيل', visibleWhen: s => s.runtimeTargets?.some(t => ['desktop', 'system'].includes(t)) },
  { id: 4, title: 'Summary', titleAr: 'ملخص للمناقشة', icon: 'i-lucide-file-text' },
  { id: 5, title: 'Database', titleAr: 'قاعدة البيانات', icon: 'i-lucide-database', contextHint: 'ظهرت لأن نوع المشروع يتضمن قاعدة بيانات', visibleWhen: s => ['fullstack', 'backend-only', 'cli-tool', 'integration'].includes(s.projectType) },
  { id: 6, title: 'Summary 2', titleAr: 'ملخص مع قاعدة البيانات', icon: 'i-lucide-file-text', visibleWhen: s => ['fullstack', 'backend-only', 'cli-tool', 'integration'].includes(s.projectType) },
  { id: 7, title: 'Communication', titleAr: 'واجهات التواصل', icon: 'i-lucide-network', contextHint: 'ظهرت لأن المشروع يحتاج واجهات تواصل', visibleWhen: s => ['fullstack', 'backend-only', 'library', 'integration'].includes(s.projectType) || s.runtimeTargets?.some(t => ['desktop', 'cli', 'system'].includes(t)) },
  { id: 8, title: 'Frontend', titleAr: 'الواجهة', icon: 'i-lucide-layout', contextHint: 'ظهرت لأن المشروع يتضمن واجهة أمامية', visibleWhen: s => ['fullstack', 'frontend-only', 'chrome-extension', 'integration'].includes(s.projectType) || s.runtimeTargets?.some(t => ['web', 'mobile', 'desktop'].includes(t)) },
  { id: 9, title: 'Features', titleAr: 'المميزات', icon: 'i-lucide-list-checks' },
  { id: 10, title: 'Dependencies', titleAr: 'المتطلبات', icon: 'i-lucide-package' },
  { id: 11, title: 'Guidelines', titleAr: 'إرشادات التطوير', icon: 'i-lucide-shield-check' }
]

export const initialWizardState: WizardState = {
  // Step 1
  projectType: 'fullstack',
  projectNature: 'product',
  runtimeTargets: ['web'],
  intelligenceLevel: 'none',
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
    frontend: 'Nuxt',
    backend: 'Express.js',
    database: 'MySQL',
    auth: 'JWT',
    uiLibrary: 'Nuxt UI',
    port: '',
    frontendPort: ''
  },
  techVersions: {},
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
  communicationInterfaces: ['http-api'],
  endpoints: [],
  apiGroups: [],

  // Step 6
  frontendMode: 'template',
  selectedTemplate: null,
  pages: [],
  frontendModules: [],
  sharedComponents: [],

  // Step 7
  mvpFeatures: [],
  futureFeatures: [],
  wireframes: '',
  edgeCases: [],
  implementationPhases: [],

  // AI Configuration
  aiConfiguration: {
    domains: [],
    models: [],
    supportedLanguages: [],
    hardwarePreference: 'any'
  },
  desktopSystemCapabilities: {
    fileSystemAccess: false,
    microphone: false,
    camera: false,
    globalShortcuts: false,
    backgroundExecution: false,
    autoStart: false
  },

  // Step 8
  packageManager: 'pnpm',
  backendDependencies: ['express', 'mysql2', 'jsonwebtoken', 'bcryptjs', 'zod', 'cors', 'dotenv'],
  frontendDependencies: ['nuxt', '@nuxt/ui', '@sidebase/nuxt-auth', '@pinia/nuxt'],
  aiDependencies: [],
  systemDependencies: [],
  buildDependencies: [],
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
    { warning: 'قبل إنشاء أي صفحة أو component، قم بمراجعة MCP servers الخاصة بـ Nuxt & Nuxt UI', enabled: true, isDefault: true },
    { warning: 'استخدم Zod schemas للتحقق من جميع المدخلات في Backend', enabled: true, isDefault: true },
    { warning: 'اتبع نمط RTL في جميع عناصر الواجهة العربية', enabled: true, isDefault: true },
    { warning: 'لا تستخدم TypeScript في ملفات Vue ما عدا إذا تم اختيار "TypeScript كامل"', enabled: true, isDefault: true },
    { warning: 'استخدم composables بدلاً من mixins أو store مباشر', enabled: true, isDefault: true },
    { warning: 'تجنب استخدام any في TypeScript - استخدم أنواع محددة', enabled: true, isDefault: true },
    { warning: 'تأكد من معالجة الأخطاء (Error handling) في كل API call', enabled: true, isDefault: true },
    { warning: 'أضف loading states لكل عملية async', enabled: true, isDefault: true },
    { warning: 'استخدم دائماً أحدث إصدارات Nuxt & Nuxt UI & Zod', enabled: true, isDefault: true }
  ],

  // MCP Servers (auto-selected based on tech stack)
  selectedMcpServers: ['nuxt-remote', 'nuxt-ui-remote'],
  includeMcpJson: false,

  // Project Status
  projectStatus: 'planning'
}

export const projectNatureOptions: { value: ProjectNature, label: string, description: string, icon: string }[] = [
  { value: 'product', label: 'منتج', description: 'تطبيق يُقدم كمنتج للمستخدمين', icon: 'i-lucide-box' },
  { value: 'tool', label: 'أداة', description: 'أداة داخلية لحل مشكلة محددة', icon: 'i-lucide-wrench' },
  { value: 'library', label: 'مكتبة', description: 'مكتبة برمجية يستخدمها مطورون آخرون', icon: 'i-lucide-library' },
  { value: 'service', label: 'خدمة', description: 'خدمة تعمل في الخلفية أو كـ API', icon: 'i-lucide-server' },
  { value: 'automation', label: 'أتمتة', description: 'نظام أتمتة لمهام متكررة', icon: 'i-lucide-bot' }
]

export const runtimeTargetOptions: { value: RuntimeTarget, label: string, description: string, icon: string }[] = [
  { value: 'web', label: 'ويب', description: 'يعمل في المتصفح', icon: 'i-lucide-globe' },
  { value: 'desktop', label: 'سطح المكتب', description: 'تطبيق سطح مكتب (Electron/Tauri)', icon: 'i-lucide-monitor' },
  { value: 'mobile', label: 'موبايل', description: 'تطبيق موبايل (iOS/Android)', icon: 'i-lucide-smartphone' },
  { value: 'cli', label: 'سطر الأوامر', description: 'أداة سطر أوامر (Terminal)', icon: 'i-lucide-terminal' },
  { value: 'system', label: 'نظام', description: 'خدمة نظام تعمل في الخلفية', icon: 'i-lucide-cpu' }
]

export const intelligenceLevelOptions: { value: IntelligenceLevel, label: string, description: string, icon: string }[] = [
  { value: 'none', label: 'بدون ذكاء', description: 'لا يستخدم أي نوع من الذكاء الاصطناعي', icon: 'i-lucide-circle-off' },
  { value: 'rules-based', label: 'قواعد ثابتة', description: 'منطق مبني على قواعد محددة مسبقاً', icon: 'i-lucide-list-tree' },
  { value: 'ai-assisted', label: 'مساعد بالذكاء', description: 'يستخدم الذكاء الاصطناعي كميزة مساعدة', icon: 'i-lucide-sparkles' },
  { value: 'ai-core', label: 'ذكاء أساسي', description: 'الذكاء الاصطناعي هو جوهر المنتج', icon: 'i-lucide-brain' }
]

export const communicationInterfaceOptions: { value: CommunicationInterface, label: string, description: string, icon: string }[] = [
  { value: 'http-api', label: 'HTTP API', description: 'REST أو GraphQL عبر HTTP', icon: 'i-lucide-network' },
  { value: 'local-ipc', label: 'IPC محلي', description: 'تواصل بين العمليات المحلية', icon: 'i-lucide-cable' },
  { value: 'tauri-commands', label: 'أوامر Tauri', description: 'أوامر Tauri للتواصل مع النظام', icon: 'i-lucide-terminal-square' },
  { value: 'cli-flags', label: 'أعلام CLI', description: 'معاملات سطر الأوامر', icon: 'i-lucide-flag' },
  { value: 'file-based', label: 'ملفات', description: 'تواصل عبر الملفات (stdin/stdout/pipes)', icon: 'i-lucide-file-input' }
]

export const aiDomainOptions: { value: string, label: string, description: string, icon: string }[] = [
  { value: 'speech-to-text', label: 'تحويل الصوت لنص', description: 'مثل Whisper', icon: 'i-lucide-mic' },
  { value: 'text-to-text', label: 'معالجة النصوص', description: 'مثل GPT, Claude', icon: 'i-lucide-text' },
  { value: 'vision', label: 'رؤية حاسوبية', description: 'مثل YOLO, OpenCV', icon: 'i-lucide-eye' },
  { value: 'audio', label: 'معالجة الصوت', description: 'توليد ومعالجة الصوت', icon: 'i-lucide-headphones' },
  { value: 'multimodal', label: 'متعدد الوسائط', description: 'نص + صورة + صوت', icon: 'i-lucide-layers' },
  { value: 'other', label: 'أخرى', description: 'مجال آخر غير مذكور', icon: 'i-lucide-plus' }
]

export const hardwarePreferenceOptions: { value: HardwarePreference, label: string, description: string, icon: string }[] = [
  { value: 'gpu-preferred', label: 'GPU مفضل', description: 'أفضل للنماذج الثقيلة (صور، فيديو، نماذج محلية)', icon: 'i-lucide-zap' },
  { value: 'cpu-only', label: 'CPU فقط', description: 'كافٍ للنماذج الخفيفة أو استخدام API فقط', icon: 'i-lucide-cpu' },
  { value: 'any', label: 'أي عتاد', description: 'المشروع يتكيف مع العتاد المتاح', icon: 'i-lucide-settings' }
]
