# سياق المشروع الكامل - Project Template Wizard

## نظرة عامة

التطبيق ده عبارة عن **Wizard من 14 خطوة** بيساعد المستخدم يملي بيانات **أي نوع مشروع برمجي** (ويب، سطح مكتب، CLI، ذكاء اصطناعي، أدوات نظام، وغيرها)، وفي الآخر بيطلعله ملفات جاهزة (Markdown + CLAUDE.md + ZIP) يقدر يديها لأي AI Assistant عشان ينفذ المشروع.

**التقنيات:** Nuxt 4 + Nuxt UI v4 + Tailwind CSS v4 + MongoDB + Zod + TypeScript

---

## هيكل المجلدات

```
project-template-wizard/
├── app/
│   ├── assets/css/main.css
│   ├── components/
│   │   ├── form/DynamicArrayField.vue        # كومبوننت عام لإضافة/حذف عناصر من Array
│   │   ├── permissions/PermissionSelector.vue # واجهة إدارة الصلاحيات والأدوار
│   │   ├── wizard/
│   │   │   ├── Container.vue                 # الحاوية الرئيسية - dynamic component rendering عبر Step Registry
│   │   │   └── steps/
│   │   │       ├── StepQuickReference.vue     # الخطوة 0: نظرة عامة + الأبعاد الجديدة
│   │   │       ├── StepUserStories.vue        # الخطوة 1: قصص المستخدم
│   │   │       ├── StepPermissions.vue        # الخطوة 2: الصلاحيات
│   │   │       ├── StepTechnical.vue          # الخطوة 3: التقنيات
│   │   │       ├── StepAIConfiguration.vue    # الخطوة 12: إعدادات الذكاء الاصطناعي (شرطية)
│   │   │       ├── StepDesktopSystem.vue      # الخطوة 13: إمكانيات النظام (شرطية)
│   │   │       ├── StepSummary.vue            # الخطوة 4: ملخص للمناقشة
│   │   │       ├── StepDatabase.vue           # الخطوة 5: قاعدة البيانات
│   │   │       ├── StepSummaryWithDB.vue      # الخطوة 6: ملخص مع DB
│   │   │       ├── StepApi.vue                # الخطوة 7: التواصل والـ API
│   │   │       ├── StepFrontend.vue           # الخطوة 8: الواجهة
│   │   │       ├── StepFeatures.vue           # الخطوة 9: المميزات
│   │   │       ├── StepDependencies.vue       # الخطوة 10: المتطلبات + AI/System/Build deps
│   │   │       └── StepGuidelines.vue         # الخطوة 11: إرشادات التطوير
│   │   ├── AppLogo.vue
│   │   └── TemplateMenu.vue                   # اختيار Template من Nuxt UI
│   ├── composables/
│   │   ├── useWizardState.ts                  # إدارة الحالة المركزية + حفظ تلقائي
│   │   ├── useStepValidation.ts               # التحقق بـ Zod لكل خطوة عبر Step Registry (async)
│   │   ├── useMarkdownGenerator.ts            # توليد project-spec.md
│   │   ├── useClaudeMdGenerator.ts            # توليد CLAUDE.md
│   │   ├── usePromptGenerator.ts              # توليد Prompt للـ AI
│   │   └── useZipGenerator.ts                 # توليد ZIP بكل الملفات
│   ├── config/
│   │   └── stepRegistry.ts                    # Step Registry: component + schema + dataExtractor لكل خطوة
│   ├── data/
│   │   ├── changelog.js                       # بيانات سجل التحديثات (releases array + getVersionBadgeColor)
│   │   └── upgrade-analysis.md                # تحليل تغييرات الترقية
│   ├── pages/
│   │   ├── index.vue                          # الصفحة الرئيسية: 4 بطاقات مميزات + عرض 7+7 خطوة تكيّفية + أزرار CTA
│   │   ├── wizard/index.vue                   # إنشاء مشروع جديد
│   │   ├── wizard/[id].vue                    # صفحة الويزارد بـ ID المشروع
│   │   ├── projects.vue                       # قائمة المشاريع
│   │   ├── changelog.vue                      # سجل التغييرات
│   │   └── methodology.vue                    # منهجية التطوير
│   ├── schemas/                               # Zod Schemas لكل خطوة
│   │   ├── quickReference.schema.ts           # + projectNature, runtimeTargets, intelligenceLevel
│   │   ├── userStories.schema.ts
│   │   ├── permissions.schema.ts
│   │   ├── technical.schema.ts
│   │   ├── database.schema.ts
│   │   ├── api.schema.ts                      # + communicationInterfaces
│   │   ├── frontend.schema.ts
│   │   ├── features.schema.ts
│   │   ├── dependencies.schema.ts             # + aiDependencies, systemDependencies, buildDependencies + createDependenciesSchema(state) factory
│   │   ├── guidelines.schema.ts
│   │   ├── aiConfiguration.schema.ts          # جديد - إعدادات الذكاء الاصطناعي
│   │   ├── desktopSystem.schema.ts            # جديد - إمكانيات سطح المكتب والنظام
│   │   └── index.ts                           # تصدير كل الـ Schemas
│   ├── types/wizard.types.ts                  # كل الأنواع والثوابت + الأبعاد الجديدة
│   ├── utils/
│   │   ├── formatTech.ts                      # تنسيق أسماء التقنيات مع الإصدارات
│   │   └── projectCapabilities.ts             # جديد - دوال needsX المركزية
│   ├── app.config.ts                          # إعدادات Nuxt UI (اللون: green، الحجم: xl)
│   └── app.vue
├── server/
│   ├── api/
│   │   ├── projects.post.ts                   # إنشاء/تحديث مشروع
│   │   ├── projects.get.ts                    # قائمة المشاريع مع Pagination
│   │   └── projects/
│   │       ├── [id].get.ts                    # جلب مشروع واحد
│   │       └── [id].delete.ts                 # حذف مشروع
│   └── utils/mongodb.ts                       # اتصال MongoDB Singleton
├── nuxt.config.ts
├── package.json
├── CLAUDE.md
└── .mcp.json
```

---

## البنية الجديدة: Step Registry Pattern

### المفهوم
بدل ما كان Container.vue فيه سلسلة `v-if/v-else-if` لكل خطوة، دلوقتي عندنا **Step Registry** مركزي في `app/config/stepRegistry.ts` بيحدد لكل خطوة:
- **component**: lazy import للكومبوننت
- **schema**: دالة async بترجع Zod schema (أو null لو الخطوة مش محتاجة validation)
- **dataExtractor**: بتطلع البيانات المطلوبة من WizardState للتحقق

Container.vue بيستخدم `defineAsyncComponent` و `<component :is>` لعرض الخطوة الحالية.

### Centralized Capabilities
دوال `needsX` اللي كانت مكررة في أكتر من composable اتنقلت كلها لـ `app/utils/projectCapabilities.ts`:
- `needsFrontend(state)` - المشروع محتاج واجهة؟
- `needsBackend(state)` - المشروع محتاج backend؟
- `needsDatabase(state)` - المشروع محتاج قاعدة بيانات؟ (يرجع false لو database = 'None')
- `needsAI(state)` - المشروع فيه ذكاء اصطناعي؟
- `needsDesktopSystem(state)` - المشروع بيشتغل على سطح المكتب/النظام؟
- `needsAPI(state)` - المشروع محتاج واجهة تواصل؟
- `needsAuth(state)` - المشروع محتاج مصادقة؟ (يرجع false لو auth = 'None')
- `needsPorts(state)` - المشروع محتاج منافذ؟ (web أو fullstack/backend-only)
- `needsEnvVars(state)` - المشروع محتاج متغيرات بيئة؟ (backend أو خدمات خارجية أو AI عبر API)
- `needsHttpApi(state)` - المشروع محتاج HTTP API؟
- `isFullyLocal(state)` - المشروع محلي بالكامل؟ (بدون backend أو خدمات خارجية أو AI عبر API)

---

## خطوات الويزارد (14 خطوة)

الخطوات **شرطية** بتظهر أو تختفي حسب `visibleWhen` function بتاخد كل الـ state dimensions:

| # | الخطوة | الـ ID | شرط الظهور (`visibleWhen`) |
|---|--------|--------|---------------------------|
| 0 | نظرة عامة (Overview) | `0` | دايماً |
| 1 | قصص المستخدم (User Stories) | `1` | دايماً |
| 2 | الصلاحيات (Permissions) | `2` | `projectType` = fullstack أو backend-only **و** `auth !== 'None'` |
| 3 | التقنيات (Technical) | `3` | دايماً |
| 4 | إعدادات الذكاء الاصطناعي (AI Config) | `12` | `intelligenceLevel` != 'none' |
| 5 | إمكانيات النظام (Desktop/System) | `13` | `runtimeTargets` يشمل desktop أو system |
| 6 | ملخص للمناقشة (Summary) | `4` | دايماً |
| 7 | قاعدة البيانات (Database) | `5` | `projectType` = fullstack, backend-only, cli-tool, integration **و** `database !== 'None'` |
| 8 | ملخص مع DB (Summary 2) | `6` | نفس Database |
| 9 | التواصل (Communication) | `7` | `projectType` = fullstack, backend-only, library, integration أو `runtimeTargets` يشمل desktop, cli, system |
| 10 | الواجهة (Frontend) | `8` | `projectType` = fullstack, frontend-only, chrome-extension, integration أو `runtimeTargets` يشمل web, mobile, desktop |
| 11 | المميزات (Features) | `9` | دايماً |
| 12 | المتطلبات (Dependencies) | `10` | دايماً |
| 13 | إرشادات التطوير (Guidelines) | `11` | دايماً |

---

## نموذج البيانات الكامل (WizardState)

### الأنواع الأساسية (Enums)

```typescript
ProjectType = 'fullstack' | 'frontend-only' | 'backend-only' | 'chrome-extension' | 'cli-tool' | 'library' | 'integration'
ProjectSize = 'small' | 'medium' | 'large'
ProjectStatus = 'planning' | 'planned' | 'completed'
Architecture = 'monolith' | 'monorepo' | 'microservices'
ApiStyle = 'REST' | 'GraphQL' | 'tRPC'
TypeScriptMode = 'config-only' | 'full'
PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'
FrontendMode = 'template' | 'custom'
ModuleType = 'none' | 'index-only' | 'crud-modal' | 'index-add-edit' | 'full-crud' | 'view-edit-combined'
PaginationType = 'backend' | 'frontend' | 'none'
TenancyModel = 'subdomain' | 'path' | 'database'
IsolationLevel = 'database' | 'schema' | 'row'
ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'uuid' | 'json' | 'text' | 'decimal'
ColumnConstraint = 'primary' | 'unique' | 'nullable' | 'notNull' | 'indexed' | 'autoIncrement' | 'foreignKey' | 'default'
RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many'
HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'custom'
PermissionSystemType = 'role-based' | 'action-based' | 'resource-based' | 'custom'
SharedComponentCategory = 'layout' | 'data' | 'feedback' | 'form' | 'navigation' | 'utility'

// === أنواع جديدة ===
ProjectNature = 'product' | 'tool' | 'library' | 'service' | 'automation'
RuntimeTarget = 'web' | 'desktop' | 'mobile' | 'cli' | 'system'
IntelligenceLevel = 'none' | 'rules-based' | 'ai-assisted' | 'ai-core'
CommunicationInterface = 'http-api' | 'local-ipc' | 'tauri-commands' | 'cli-flags' | 'file-based'
HardwarePreference = 'gpu-preferred' | 'cpu-preferred' | 'cpu-only' | 'any'
```

### الحالة الكاملة WizardState

```typescript
interface WizardState {
  // === الخطوة 0: نظرة عامة ===
  projectType: ProjectType              // نوع المشروع
  projectNature: ProjectNature          // طبيعة المشروع (منتج، أداة، مكتبة، خدمة، أتمتة)
  runtimeTargets: RuntimeTarget[]       // بيئات التشغيل (ويب، سطح مكتب، موبايل، CLI، نظام)
  intelligenceLevel: IntelligenceLevel  // مستوى الذكاء (بدون، قواعد، مساعد، أساسي)
  projectSize: ProjectSize              // حجم المشروع (small/medium/large)
  projectName: string                   // اسم المشروع بالعربي أو الإنجليزي
  projectNameTechnical: string          // اسم تقني بصيغة kebab-case
  problemStatement: string              // وصف المشكلة (20 حرف على الأقل)
  solutionDescription: string           // وصف الحل (20 حرف على الأقل)
  targetUsers: string                   // الفئة المستهدفة (5 حروف على الأقل)
  targetUserType: string                // نوع المستخدم
  targetUserLevel: string               // مستوى المستخدم التقني
  primaryLanguage: string               // اللغة الأساسية للواجهة

  // === الخطوة 1: قصص المستخدم ===
  userTypes: UserType[]

  // === الخطوة 2: الصلاحيات (شرطية) ===
  permissionsConfig: { enabled: boolean, systemType: PermissionSystemType }
  permissions: Permission[]
  roles: Role[]

  // === الخطوة 3: التقنيات ===
  techStack: { frontend, backend, database, auth, runtime, uiLibrary, orm, frontendPort, port }
  techVersions: Record<string, string>
  architecture: Architecture
  multiTenancy: { enabled, tenancyModel, isolationLevel, tenantIdentifier }
  externalServices: string[]

  // === الخطوة 12: إعدادات الذكاء الاصطناعي (شرطية) ===
  aiConfiguration: AIConfiguration      // المجالات، النماذج، اللغات، تفضيل العتاد

  // === الخطوة 13: إمكانيات النظام (شرطية) ===
  desktopSystemCapabilities: DesktopSystemCapabilities  // 6 إمكانيات (ملفات، ميكروفون، كاميرا، اختصارات، خلفية، تشغيل تلقائي)

  // === الخطوة 7: التواصل والـ API (شرطية) ===
  communicationInterfaces: CommunicationInterface[]  // واجهات التواصل
  apiStyle: ApiStyle
  routePrefix: string
  endpoints: Endpoint[]
  apiGroups: ApiGroup[]

  // === الخطوة 5: قاعدة البيانات ===
  tables: Table[]
  relationships: string

  // === الخطوة 8: الواجهة ===
  frontendMode: FrontendMode
  selectedTemplate: string
  pages: Page[]
  frontendModules: FrontendModule[]
  sharedComponents: SharedComponent[]

  // === الخطوة 9: المميزات ===
  mvpFeatures: string[]
  futureFeatures: string[]
  wireframes: string
  edgeCases: EdgeCase[]
  implementationPhases: Phase[]

  // === الخطوة 10: المتطلبات ===
  packageManager: PackageManager
  backendDependencies: string[]
  frontendDependencies: string[]
  aiDependencies: string[]              // مكتبات الذكاء الاصطناعي (شرطية)
  systemDependencies: string[]          // مكتبات النظام (شرطية)
  buildDependencies: string[]           // مكتبات البناء
  environmentVariables: EnvVariable[]
  seedData: string

  // === الخطوة 11: إرشادات التطوير ===
  useTypeScript: TypeScriptMode
  developmentWarnings: DevelopmentWarning[]
  selectedMcpServers: string[]
  includeMcpJson: boolean

  // === حالة المشروع ===
  projectStatus: ProjectStatus
  deletedAt: string | null
}
```

### الأنواع الفرعية الجديدة

```typescript
interface AIModel {
  name: string
  isOpenSource: boolean
  isAPI: boolean
  offlineSupport: boolean
}

interface AIConfiguration {
  domains: string[]                     // مجالات الذكاء (speech-to-text, vision, etc.)
  models: AIModel[]                     // النماذج المستخدمة
  supportedLanguages: string[]          // اللغات المدعومة
  hardwarePreference: HardwarePreference // تفضيل العتاد (GPU, CPU, أي)
}

interface DesktopSystemCapabilities {
  fileSystemAccess: boolean             // الوصول لنظام الملفات
  microphone: boolean                   // الميكروفون
  camera: boolean                       // الكاميرا
  globalShortcuts: boolean              // اختصارات لوحة المفاتيح العامة
  backgroundExecution: boolean          // العمل في الخلفية
  autoStart: boolean                    // التشغيل التلقائي مع النظام
}
```

### الأنواع الفرعية القديمة

```typescript
interface UserType {
  userType: string
  stories: UserStory[]
  roleId?: string
}

interface UserStory { story: string }

interface Permission { id, name, resource, action: PermissionAction, description }
interface Role { id, name, description, permissions: string[], inheritsFrom? }

interface Table { tableName, description, columns: Column[] }
interface Column { name, type: ColumnType, constraints: ColumnConstraint[], foreignKey?, defaultValue? }

interface ApiGroup { name, basePath, description, endpoints: Endpoint[] }
interface Endpoint { method: HttpMethod, path, description, authRequired, requiredPermissions, queryParameters, body, response }
interface QueryParameter { name, type, required, description, example }

interface FrontendModule { name, basePath, description, moduleType: ModuleType, paginationType: PaginationType, pages: Page[] }
interface Page { path, name, description, auth, requiredPermissions, requiredRoles }
interface SharedComponent { name, description, category: SharedComponentCategory }

interface EdgeCase { scenario, handling }
interface Phase { phaseName, tasks: string[] }
interface EnvVariable { name, description, required, example }
interface DevelopmentWarning { warning, enabled, isDefault }
```

---

## قواعد التحقق (Validation) لكل خطوة

### الخطوة 0 - نظرة عامة
- `projectType`: مطلوب، من القيم المحددة
- `projectNature`: مطلوب، من القيم المحددة (default: 'product')
- `runtimeTargets`: مصفوفة، عنصر واحد على الأقل
- `intelligenceLevel`: مطلوب، من القيم المحددة (default: 'none')
- `projectSize`: مطلوب
- `projectName`: مطلوب، 2-200 حرف
- `projectNameTechnical`: مطلوب، صيغة kebab-case فقط
- `problemStatement`: مطلوب، 20 حرف على الأقل
- `solutionDescription`: مطلوب، 20 حرف على الأقل
- `targetUsers`: مطلوب، 5 حروف على الأقل

### الخطوة 12 - إعدادات الذكاء الاصطناعي
- `aiConfiguration.domains`: مصفوفة، عنصر واحد على الأقل
- `aiConfiguration.models`: مصفوفة، نموذج واحد على الأقل (كل نموذج يتطلب name)
- `aiConfiguration.supportedLanguages`: مصفوفة (اختيارية)
- `aiConfiguration.hardwarePreference`: مطلوب ('gpu-preferred', 'cpu-preferred', 'cpu-only', 'any')

### الخطوة 13 - إمكانيات النظام
- `desktopSystemCapabilities`: 6 حقول boolean (بدون validation مطلوب)

### الخطوة 3 - التقنيات
- `techStack.database`: يشمل خيار `'None'` (بدون قاعدة بيانات) — عند اختياره تختفي خطوات 5 و 6
- `techStack.auth`: يشمل خيار `'None'` (بدون مصادقة) — عند اختياره تختفي خطوة 2

### الخطوة 10 - المتطلبات (Conditional Validation)
يستخدم factory function `createDependenciesSchema(state)` بدل schema ثابت:
- `backendDependencies`: مطلوب (min 1) فقط لو `needsBackend(state)` — اختياري للباقي
- `frontendDependencies`: مطلوب (min 1) فقط لو `needsFrontend(state)` — اختياري للباقي
- `environmentVariables`: مطلوب (min 1) فقط لو `needsEnvVars(state)` — اختياري للباقي
- `aiDependencies`, `systemDependencies`, `buildDependencies`: مصفوفات اختيارية دايماً

### الخطوات 1-11 (باقي)
نفس الـ validation القديم مع الإضافات التالية:
- **الخطوة 7 (التواصل)**: `communicationInterfaces` مصفوفة اختيارية

---

## الـ Composables (الدوال المركزية)

### useWizardState
**الوظيفة**: إدارة حالة الويزارد كاملة

- `state` - كائن WizardState المركزي (useState للـ SSR)
- `currentStep` - رقم الخطوة الحالية المرئية
- `visibleSteps` - الخطوات المرئية حسب `visibleWhen` functions
- `needsAI` - computed: المشروع فيه ذكاء اصطناعي
- `needsDesktopSystem` - computed: المشروع بيشتغل على سطح المكتب/النظام
- `needsFrontend` - computed: المشروع محتاج واجهة
- `needsBackend` - computed: المشروع محتاج backend
- `needsDatabase` - computed: المشروع محتاج قاعدة بيانات (false لو 'None')
- `needsAuth` - computed: المشروع محتاج مصادقة (false لو 'None')
- `needsPorts` - computed: المشروع محتاج منافذ
- `needsEnvVars` - computed: المشروع محتاج متغيرات بيئة
- `needsHttpApi` - computed: المشروع محتاج HTTP API
- `fullyLocal` - computed: المشروع محلي بالكامل
- `updateField(key, value)` - تحديث حقل
- `updateNestedField(key, nestedKey, value)` - تحديث حقل متداخل
- `nextStep()` / `prevStep()` / `goToStep(step)` - التنقل
- `resetState()` - مسح كل البيانات
- `saveToLocalStorage()` / `loadFromLocalStorage()` - حفظ محلي
- `createProject()` / `loadProject(projectId)` / `saveToCloud()` - MongoDB
- `fetchProjects(options)` / `deleteProject()` / `softDeleteProject()` / `restoreProject()`
- `migrateState(data)` - ترحيل بيانات قديمة بإضافة defaults للحقول الجديدة

**الحفظ التلقائي**: يراقب التغييرات ويحفظ في MongoDB بعد 1000ms debounce

### useStepValidation
**الوظيفة**: التحقق من صحة بيانات كل خطوة بـ Zod عبر Step Registry

- `validateStep(visibleIndex)` → `Promise<{ valid: boolean, errors: string[] }>` (async)
- `validateCurrentStep()` - تحقق من الخطوة الحالية
- بيستخدم `getStepSchema()` و `getStepData()` من stepRegistry

### useMarkdownGenerator
**الوظيفة**: توليد ملف `project-spec.md`

- `generateMarkdown(state)` - يولد مستند Markdown كامل
- `downloadMarkdown(state)` - يحمّل كملف .md

**الأقسام المولّدة**: Quick Reference (مع الأبعاد الجديدة)، نظرة عامة، قصص المستخدم، الصلاحيات، التقنيات، **إعدادات الذكاء الاصطناعي** (شرطي)، **إمكانيات النظام** (شرطي)، قاعدة البيانات، API، الواجهة، المميزات، المتطلبات (مع AI/System/Build deps)، متغيرات البيئة، إرشادات التطوير

**Capability-gated output**: الأقسام بتظهر بشكل شرطي حسب القدرات:
- صفوف قاعدة البيانات: تختفي لو `database = 'None'`
- صفوف المصادقة: تختفي لو `auth = 'None'`
- صفوف المنافذ: تختفي لو `!needsPorts(state)`
- Multi-tenancy: يختفي لو `!needsDatabase(state)`
- متغيرات البيئة: القسم كله يختفي لو `!needsEnvVars(state)`
- Seed Data: يختفي لو `!needsDatabase(state)`

### useClaudeMdGenerator
**الوظيفة**: توليد ملف `CLAUDE.md` بتعليمات AI

- `generateClaudeMd(state)` - يولد محتوى CLAUDE.md
- يتضمن: Project Overview (مع الأبعاد الجديدة)، MCP checklist، إعداد المشروع، متطلبات الإصدارات، **AI Integration Guidelines** (شرطي)، **Desktop/System Guidelines** (شرطي)، إرشادات الكود

### usePromptGenerator
**الوظيفة**: توليد Prompt تهيئة للـ AI

- `generatePrompt(state)` - prompt نصي (يتضمن projectNature, runtimeTargets, intelligenceLevel)
- `generateClaudeCommand(state)` - ملف `.claude/commands/project.md`

### useZipGenerator
**الوظيفة**: توليد ZIP بكل ملفات المشروع

- `downloadZip(state)` - يُنشئ ZIP يحتوي على:
  - `.mcp.json` (لو مفعّل)
  - `CLAUDE.md`
  - `project-spec.md`
  - `fix.md`
  - `.env.example`
  - `.claude/commands/project.md`
  - `.claude/commands/test-playwright.md`

---

## Server API

### POST /api/projects
**إنشاء أو تحديث مشروع**
```
Body: { data: WizardState, projectId?: string }
Response: { success: true, projectId: string }
```

### GET /api/projects
**قائمة المشاريع مع Pagination**
```
Query: ?page=1&limit=5&status=planning&archived=false&countOnly=false
Response: { projects: [...], pagination: { page, limit, total, totalPages } }
أو: { counts: { all, planning, planned, completed, archived } }
```

### GET /api/projects/:id
**جلب مشروع واحد**

### DELETE /api/projects/:id
**حذف مشروع نهائيًا**

---

## الثوابت المهمة

### Option Arrays (للواجهة)
| المصفوفة | عدد الخيارات | الاستخدام |
|----------|-------------|----------|
| `projectNatureOptions` | 5 | طبيعة المشروع (منتج، أداة، مكتبة، خدمة، أتمتة) |
| `runtimeTargetOptions` | 5 | بيئات التشغيل (ويب، سطح مكتب، موبايل، CLI، نظام) |
| `intelligenceLevelOptions` | 4 | مستوى الذكاء (بدون، قواعد، مساعد، أساسي) |
| `communicationInterfaceOptions` | 5 | واجهات التواصل (HTTP API, IPC, Tauri, CLI, ملفات) |
| `aiDomainOptions` | 6 | مجالات الذكاء (speech-to-text, text-to-text, vision, audio, multimodal, other) |
| `hardwarePreferenceOptions` | 4 | تفضيل العتاد (GPU, CPU مفضل, CPU فقط, أي) |

### Common Dependencies
| المصفوفة | عدد المكتبات | الاستخدام |
|----------|-------------|----------|
| `commonAiDeps` | 8 | openai, @anthropic-ai/sdk, langchain, ollama, etc. |
| `commonSystemDeps` | 7 | @tauri-apps/api, electron, node-pty, etc. |
| `commonBuildDeps` | 7 | vite, esbuild, rollup, tsup, etc. |

### قوالب Nuxt UI المتاحة (11 قالب)
Dashboard, SaaS, Landing, Docs, Chat, Editor, Portfolio, Changelog, Starter (Nuxt), Dashboard (Vue), Starter (Vue)

### سيرفرات MCP المتاحة (4 سيرفرات)
| السيرفر | الوظيفة |
|---------|---------|
| nuxt-remote | توثيق Nuxt |
| nuxt-ui-remote | كومبوننتات Nuxt UI |
| playwright | أتمتة المتصفح |
| github | GitHub CLI |

---

## Backward Compatibility

الدالة `migrateState(data)` في `useWizardState.ts` بتضيف defaults لكل الحقول الجديدة لو مش موجودة:
```
projectNature → 'product'
runtimeTargets → ['web']
intelligenceLevel → 'none'
aiConfiguration → { domains: [], models: [], supportedLanguages: [], hardwarePreference: 'any' }
desktopSystemCapabilities → { all false }
communicationInterfaces → ['http-api']
aiDependencies → []
systemDependencies → []
buildDependencies → []
```

ده بيضمن إن المشاريع القديمة المحفوظة في localStorage أو MongoDB تتحمل بدون أخطاء.

---

## الظهور الشرطي على مستوى الحقول (Field-level Visibility)

بالإضافة لإخفاء الخطوات كاملة عبر `visibleWhen`، فيه إخفاء شرطي داخل الخطوات نفسها:

### StepTechnical.vue
- حقول المنافذ (Ports): `v-if="needsPorts"` — تختفي للمشاريع اللي مش محتاجة ويب أو backend
- Multi-tenancy: `v-if="needsBackend && state.techStack.database !== 'None'"` — يختفي بدون قاعدة بيانات

### StepDependencies.vue
- Backend Dependencies: `v-if="needsBackend"` — تختفي للمشاريع بدون backend
- Frontend Dependencies: `v-if="needsFrontend"` — تختفي للمشاريع بدون واجهة
- Seed Data: `v-if="needsDatabase"` — يختفي بدون قاعدة بيانات
- الحد الأدنى لعدد التبعيات: يتغير حسب القدرات (0 للاختياري، 1 للمطلوب)

### StepAIConfiguration.vue
- تعيين تلقائي لتفضيل العتاد إلى `cpu-preferred` عند إضافة نماذج محلية (offlineSupport && !isAPI) وكان التفضيل `any`
- تفعيل تلقائي لـ `offlineSupport` عند إلغاء `isAPI` لنموذج

---

## القواعد والاتفاقيات

1. **بدون تعليقات في الكود** - لا يتم إضافة أي تعليقات في الملفات
2. **JavaScript في Vue** - TypeScript فقط في ملفات `*.config.ts`
3. **واجهة عربية RTL** - الواجهة بالعربي مع دعم RTL
4. **Zod للتحقق** - كل المدخلات تتحقق بـ Zod schemas
5. **Device ID بـ nanoid** - التعريف بالجهاز وليس بحساب مستخدم
6. **useState للـ SSR** - بدون Pinia، الحالة بـ composables
7. **Nuxt UI v4** - استخدام كومبوننتات Nuxt UI الرسمية
8. **الحفظ التلقائي** - كل تغيير يتحفظ تلقائي بعد 1 ثانية في MongoDB + localStorage
9. **Step Registry** - أي خطوة جديدة لازم تتسجل في `stepRegistry.ts`
10. **Centralized Capabilities** - دوال `needsX` كلها في `projectCapabilities.ts`
11. **visibleWhen functions** - ظهور الخطوات محدد بدوال في `WIZARD_STEPS` مش بمصفوفات ثابتة
