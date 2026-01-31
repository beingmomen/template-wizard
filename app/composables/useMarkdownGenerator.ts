import type { WizardState, ProjectType, ProjectNature, IntelligenceLevel } from '~/types/wizard.types'
import { NUXT_UI_TEMPLATES } from '~/types/wizard.types'
import { needsFrontend as _needsFrontend, needsBackend as _needsBackend, needsDatabase as _needsDatabase, needsAI as _needsAI, needsDesktopSystem as _needsDesktopSystem } from '~/utils/projectCapabilities'

const projectTypeLabels: Record<ProjectType, string> = {
  'fullstack': 'Fullstack Application',
  'frontend-only': 'Frontend Only',
  'backend-only': 'Backend/API Only',
  'chrome-extension': 'Chrome Extension',
  'cli-tool': 'CLI Tool',
  'library': 'Library/Package',
  'integration': 'Integration Service'
}

const projectNatureLabels: Record<ProjectNature, string> = {
  product: 'منتج',
  tool: 'أداة',
  library: 'مكتبة',
  service: 'خدمة',
  automation: 'أتمتة'
}

const intelligenceLevelLabels: Record<IntelligenceLevel, string> = {
  'none': 'بدون ذكاء',
  'rules-based': 'قواعد ثابتة',
  'ai-assisted': 'مساعد بالذكاء',
  'ai-core': 'ذكاء أساسي'
}

export function useMarkdownGenerator() {
  // Generate Quick Reference section
  const generateQuickReference = (state: WizardState): string => {
    const projectType = state.projectType || 'fullstack'
    let content = `# Project Specification: ${state.projectName}

## Quick Reference | مرجع سريع

| الحقل | القيمة |
|-------|--------|
| نوع المشروع | ${projectTypeLabels[projectType]} |
| طبيعة المشروع | ${projectNatureLabels[state.projectNature] || state.projectNature} |
| بيئات التشغيل | ${state.runtimeTargets?.join(', ') || 'web'} |
| مستوى الذكاء | ${intelligenceLevelLabels[state.intelligenceLevel] || state.intelligenceLevel} |
| حجم المشروع | ${state.projectSize === 'small' ? 'صغير' : state.projectSize === 'medium' ? 'متوسط' : 'كبير'} |
| الاسم التقني | ${state.projectNameTechnical} |
| البنية | ${state.architecture} |
| واجهات التواصل | ${state.communicationInterfaces?.join(', ') || 'http-api'} |`

    if (state.techStack.frontend) content += `\n| Frontend | ${formatTechWithVersion(state.techVersions, state.techStack.frontend)} |`
    if (state.techStack.backend) content += `\n| Backend | ${formatTechWithVersion(state.techVersions, state.techStack.backend)} |`
    if (state.techStack.database) content += `\n| Database | ${formatTechWithVersion(state.techVersions, state.techStack.database)} |`
    if (state.techStack.auth) content += `\n| Auth | ${state.techStack.auth} |`
    if (state.techStack.runtime) content += `\n| Runtime | ${formatTechWithVersion(state.techVersions, state.techStack.runtime)} |`
    if (state.techStack.uiLibrary) content += `\n| UI Library | ${formatTechWithVersion(state.techVersions, state.techStack.uiLibrary)} |`
    if (state.techStack.frontendPort) content += `\n| Frontend Port | ${state.techStack.frontendPort} |`
    if (state.techStack.port) content += `\n| Backend Port | ${state.techStack.port} |`
    if (state.packageManager) content += `\n| Package Manager | ${state.packageManager} |`
    if (state.multiTenancy?.enabled) content += `\n| Multi-tenancy | ${state.multiTenancy.model} (${state.multiTenancy.isolationLevel}) |`

    return content
  }

  // Generate Project Overview
  const generateProjectOverview = (state: WizardState): string => {
    return `## 1. Project Overview | نظرة عامة

### 1.1 اسم المشروع
\`\`\`
الاسم: ${state.projectName}
الاسم التقني: ${state.projectNameTechnical}
\`\`\`

### 1.2 المشكلة
\`\`\`
${state.problemStatement}
\`\`\`

### 1.3 الحل
\`\`\`
${state.solutionDescription}
\`\`\`

### 1.4 المستخدمين المستهدفين
\`\`\`
${state.targetUsers}
- النوع: ${state.targetUserType === 'individuals' ? 'أفراد' : state.targetUserType === 'companies' ? 'شركات' : 'كلاهما'}
- المستوى: ${state.targetUserLevel === 'beginner' ? 'مبتدئ' : state.targetUserLevel === 'intermediate' ? 'متوسط' : 'متقدم'}
- اللغة: ${state.primaryLanguage === 'ar' ? 'عربي (RTL - من اليمين لليسار)' : state.primaryLanguage === 'en' ? 'إنجليزي (LTR - من اليسار لليمين)' : 'كلاهما (RTL + LTR) - يتطلب @nuxtjs/i18n + Nuxt UI locale'}
\`\`\``
  }

  // Generate User Stories
  const generateUserStories = (state: WizardState): string => {
    let content = `## 2. User Stories | قصص المستخدم\n\n`

    const roles = state.roles || []

    state.userTypes.forEach((ut, i) => {
      const linkedRole = ut.roleId ? roles.find(r => r.id === ut.roleId) : null
      const roleLabel = linkedRole ? ` (الدور: ${linkedRole.name})` : ''
      content += `### 2.${i + 1} ${ut.userType}${roleLabel}\n\`\`\`\n`
      ut.stories.forEach((s) => {
        content += `- ${s.story}\n`
      })
      content += `\`\`\`\n\n`
    })

    return content
  }

  // Generate Permissions & Roles
  const generatePermissionsSection = (state: WizardState): string => {
    if (!state.permissionsConfig?.enabled) return ''

    let content = `## 3. Permissions & Roles | الصلاحيات والأدوار

### 3.1 Permissions System Configuration
\`\`\`yaml
Type: ${state.permissionsConfig.type}
${state.permissionsConfig.superAdminRole ? `Super Admin Role: ${state.permissionsConfig.superAdminRole}` : ''}
${state.permissionsConfig.defaultRole ? `Default Role: ${state.permissionsConfig.defaultRole}` : ''}
\`\`\`
`

    if (state.permissions?.length > 0) {
      content += `
### 3.2 Permissions List
\`\`\`yaml\n`
      state.permissions.forEach((p) => {
        content += `${p.id}:
  name: ${p.name}
  resource: ${p.resource}
  action: ${p.action}
${p.description ? `  description: ${p.description}` : ''}
`
      })
      content += `\`\`\`
`
    }

    if (state.roles?.length > 0) {
      content += `
### 3.3 Roles
\`\`\`yaml\n`
      state.roles.forEach((r) => {
        content += `${r.id}:
  name: ${r.name}
${r.description ? `  description: ${r.description}` : ''}
  permissions: [${r.permissions.join(', ')}]
${r.inheritsFrom ? `  inherits_from: ${r.inheritsFrom}` : ''}
`
      })
      content += `\`\`\``
    }

    return content
  }

  // Generate External Services
  const generateExternalServices = (state: WizardState): string => {
    if (!state.externalServices?.length) return ''

    let content = `## External Services | الخدمات الخارجية\n\n`

    state.externalServices.forEach((service, i) => {
      content += `### ${i + 1}. ${service.name} (${service.type})
\`\`\`yaml
${service.apiUrl ? `API URL: ${service.apiUrl}` : ''}
Description: ${service.description}
${service.envVars?.length > 0 ? `Environment Variables: [${service.envVars.join(', ')}]` : ''}
\`\`\`
`
    })

    return content
  }

  // Generate Technical Requirements
  const generateTechnicalRequirements = (state: WizardState): string => {
    const techStackLines = []
    if (state.techStack.frontend) techStackLines.push(`Frontend: ${formatTechWithVersion(state.techVersions, state.techStack.frontend)}`)
    if (state.techStack.backend) techStackLines.push(`Backend: ${formatTechWithVersion(state.techVersions, state.techStack.backend)}`)
    if (state.techStack.database) techStackLines.push(`Database: ${formatTechWithVersion(state.techVersions, state.techStack.database)}`)
    if (state.techStack.auth) techStackLines.push(`Authentication: ${state.techStack.auth}`)
    if (state.techStack.runtime) techStackLines.push(`Runtime: ${formatTechWithVersion(state.techVersions, state.techStack.runtime)}`)
    if (state.techStack.uiLibrary) techStackLines.push(`UI Library: ${formatTechWithVersion(state.techVersions, state.techStack.uiLibrary)}`)
    if (state.techStack.orm) techStackLines.push(`ORM: ${state.techStack.orm}`)
    if (state.techStack.fileUpload) techStackLines.push(`File Upload: ${state.techStack.fileUpload}`)
    if (state.techStack.pdfGeneration) techStackLines.push(`PDF Generation: ${state.techStack.pdfGeneration}`)
    if (state.techStack.email) techStackLines.push(`Email: ${state.techStack.email}`)
    if (state.techStack.frontendPort) techStackLines.push(`Frontend Port: ${state.techStack.frontendPort}`)
    if (state.techStack.port) techStackLines.push(`Backend Port: ${state.techStack.port}`)

    let content = `## Technical Requirements | المتطلبات التقنية

### Tech Stack
\`\`\`yaml
${techStackLines.join('\n')}
\`\`\`

### Architecture
\`\`\`
البنية: ${state.architecture === 'monolith' ? 'Monolith - تطبيق واحد' : state.architecture === 'monorepo' ? 'Monorepo - عدة تطبيقات' : 'Microservices - خدمات منفصلة'}
\`\`\``

    if (state.architecture === 'monorepo') {
      content += `

> **ملاحظة هامة**: في بنية Monorepo، يجب إنشاء التطبيقات داخل مجلد \`apps/\` والحزم المشتركة داخل مجلد \`packages/\`. لا تنشئ ملفات المشروع مباشرة في المجلد الرئيسي.`
    }

    if (state.multiTenancy?.enabled) {
      content += `

### Multi-tenancy
\`\`\`
Model: ${state.multiTenancy.model}
Isolation: ${state.multiTenancy.isolationLevel}
\`\`\``
    }

    return content
  }

  // Generate Database Design
  const generateDatabaseDesign = (state: WizardState): string => {
    let content = `## 4. Database Design | تصميم قاعدة البيانات

### 4.1 Database Schema
\`\`\`sql\n`

    state.tables.forEach((table) => {
      content += `-- ${table.description || table.tableName}\n`
      content += `CREATE TABLE ${table.tableName} (\n`
      table.columns.forEach((col, i) => {
        const type = col.type === 'string'
          ? 'VARCHAR(255)'
          : col.type === 'number'
            ? 'INT'
            : col.type === 'decimal'
              ? 'DECIMAL(10,2)'
              : col.type === 'boolean'
                ? 'BOOLEAN'
                : col.type === 'date'
                  ? 'TIMESTAMP'
                  : col.type === 'uuid'
                    ? 'CHAR(36)'
                    : col.type === 'json' ? 'JSON' : 'TEXT'

        const constraints = []
        if (col.constraints.includes('primary')) constraints.push('PRIMARY KEY')
        if (col.constraints.includes('unique')) constraints.push('UNIQUE')
        if (!col.constraints.includes('nullable')) constraints.push('NOT NULL')

        const comma = i < table.columns.length - 1 ? ',' : ''
        content += `  ${col.name} ${type}${constraints.length ? ' ' + constraints.join(' ') : ''}${comma}\n`
      })
      content += `);\n\n`
    })

    content += `\`\`\``

    if (state.relationships) {
      content += `

### 4.2 Relationships
\`\`\`
${state.relationships}
\`\`\``
    }

    return content
  }

  // Generate API Design
  const generateApiDesign = (state: WizardState): string => {
    const hasApiGroups = state.apiGroups?.length > 0
    const hasLegacyEndpoints = state.endpoints?.length > 0

    if (!hasApiGroups && !hasLegacyEndpoints) return ''

    let content = `## API Design | تصميم الـ API

### API Style: ${state.apiStyle}
${state.routePrefix ? `Base Prefix: ${state.routePrefix}` : ''}
`

    const generateEndpointYaml = (ep: typeof state.endpoints[0]) => {
      const permissions = (ep.requiredPermissions?.length ?? 0) > 0
        ? `\n  permissions: [${ep.requiredPermissions?.join(', ')}]`
        : ''
      const queryParams = ep.queryParameters?.length > 0
        ? `\n  queryParameters:\n${ep.queryParameters.map(p =>
          `    - ${p.name}: ${p.type}${p.required ? ' (required)' : ''}${p.description ? ` # ${p.description}` : ''}`
        ).join('\n')}`
        : ''
      return `${ep.method} ${ep.path}:
  description: ${ep.description}
  auth: ${ep.authRequired ? 'required' : 'none'}${permissions}${queryParams}
${ep.body ? `  body: ${ep.body}` : ''}
${ep.response ? `  response: ${ep.response}` : ''}`
    }

    if (hasApiGroups) {
      state.apiGroups.forEach((group) => {
        content += `
### ${group.name}
${group.description ? `> ${group.description}` : ''}
\`\`\`yaml\n`
        group.endpoints?.forEach((ep) => {
          content += generateEndpointYaml(ep) + '\n\n'
        })
        content += `\`\`\`
`
      })
    }

    if (hasLegacyEndpoints) {
      content += `
### Endpoints
\`\`\`yaml\n`
      state.endpoints.forEach((ep) => {
        content += generateEndpointYaml(ep) + '\n\n'
      })
      content += `\`\`\``
    }

    return content
  }

  // Generate Frontend Pages
  const generateFrontendPages = (state: WizardState): string => {
    let content = ''
    const isTemplateMode = state.frontendMode === 'template' && state.selectedTemplate

    if (isTemplateMode) {
      const template = NUXT_UI_TEMPLATES.find(t => t.id === state.selectedTemplate)
      if (template) {
        content += `## Frontend Pages | صفحات الواجهة

### Nuxt UI Template: ${template.name}
\`\`\`yaml
Template: ${template.name}
Framework: ${template.framework}
Description: ${template.description}
Preview: ${template.previewUrl}
GitHub: ${template.githubUrl}
Features:
${template.features.map(f => `  - ${f}`).join('\n')}
\`\`\`

> استخدم هذا القالب كأساس للواجهة. قم بتشغيل \`/nuxt-ui-remote:setup_project_with_template\` واختر قالب "${template.name}".
`
      }
    }

    const hasPages = state.pages?.length > 0
    const hasModules = state.frontendModules?.length > 0
    const hasComponents = state.sharedComponents?.length > 0

    if (!content && !hasPages && !hasModules && !hasComponents) return ''

    if (!content) {
      content = `## Frontend Pages | صفحات الواجهة\n`
    }

    if (hasModules) {
      content += `\n### ${isTemplateMode ? 'Modules إضافية' : 'Modules'}\n`
      state.frontendModules.forEach((mod) => {
        const moduleTypeLine = mod.moduleType && mod.moduleType !== 'none' ? `\n> Module Type: ${mod.moduleType}` : ''
        const paginationLine = mod.paginationType && mod.paginationType !== 'none' ? `\n> Pagination: ${mod.paginationType}` : ''
        content += `
#### ${mod.name}
> ${mod.description || 'No description'}
> Base Path: ${mod.basePath}${moduleTypeLine}${paginationLine}

\`\`\`yaml\n`
        mod.pages?.forEach((page) => {
          const permissions = (page.requiredPermissions?.length ?? 0) > 0
            ? `\n  permissions: [${page.requiredPermissions?.join(', ')}]`
            : ''
          const roles = (page.requiredRoles?.length ?? 0) > 0
            ? `\n  roles: [${page.requiredRoles?.join(', ')}]`
            : ''
          content += `${page.path}:
  name: ${page.name}
  description: ${page.description}
  auth: ${page.auth ? 'required' : 'public'}${permissions}${roles}

`
        })
        content += `\`\`\`\n`
      })
    }

    if (hasPages) {
      content += `
### Pages List
\`\`\`yaml\n`

      state.pages?.forEach((page) => {
        const permissions = (page.requiredPermissions?.length ?? 0) > 0
          ? `\n  permissions: [${page.requiredPermissions?.join(', ')}]`
          : ''
        const roles = (page.requiredRoles?.length ?? 0) > 0
          ? `\n  roles: [${page.requiredRoles?.join(', ')}]`
          : ''
        content += `${page.path}:
  name: ${page.name}
  description: ${page.description}
  auth: ${page.auth ? 'required' : 'public'}${permissions}${roles}

`
      })

      content += `\`\`\``
    }

    if (hasComponents) {
      content += `

### Shared Components | المكونات المشتركة

| المكون | الوصف |
|--------|-------|
`
      state.sharedComponents.forEach((comp) => {
        content += `| ${comp.name} | ${comp.description} |\n`
      })
    }

    return content
  }

  // Generate Features List
  const generateFeaturesList = (state: WizardState): string => {
    let content = `## 7. Features List | قائمة المميزات

### 7.1 MVP Features
\`\`\`\n`

    state.mvpFeatures.forEach((f) => {
      content += `[ ] ${f}\n`
    })

    content += `\`\`\``

    if (state.futureFeatures.length > 0) {
      content += `

### 7.2 Future Features
\`\`\`\n`
      state.futureFeatures.forEach((f) => {
        content += `[ ] ${f}\n`
      })
      content += `\`\`\``
    }

    return content
  }

  // Generate Wireframes (for medium/large)
  const generateWireframes = (state: WizardState): string => {
    if (!state.wireframes) return ''
    return `## 8. UI Wireframes | رسومات الشاشات

\`\`\`
${state.wireframes}
\`\`\``
  }

  // Generate Edge Cases (for medium/large)
  const generateEdgeCases = (state: WizardState): string => {
    if (!state.edgeCases.length) return ''

    let content = `## 9. Edge Cases | الحالات الاستثنائية\n\n`

    state.edgeCases.forEach((ec, i) => {
      content += `### ${i + 1}. ${ec.scenario}
\`\`\`
${ec.handling}
\`\`\`\n\n`
    })

    return content
  }

  // Generate Implementation Phases
  const generateImplementationPhases = (state: WizardState): string => {
    if (!state.implementationPhases.length) return ''

    let content = `## 10. Implementation Phases | مراحل التنفيذ\n\n`

    state.implementationPhases.forEach((phase, i) => {
      content += `### Phase ${i + 1}: ${phase.phaseName}
\`\`\`\n`
      phase.tasks.forEach((task, j) => {
        content += `${j + 1}. [ ] ${task}\n`
      })
      content += `\`\`\`\n\n`
    })

    return content
  }

  const generateAIConfiguration = (state: WizardState): string => {
    const ai = state.aiConfiguration
    if (!ai) return ''

    let content = `## AI Configuration | إعدادات الذكاء الاصطناعي

### Intelligence Level: ${intelligenceLevelLabels[state.intelligenceLevel]}

### AI Domains
\`\`\`yaml
${ai.domains.map(d => `- ${d}`).join('\n')}
\`\`\`

### AI Models
\`\`\`yaml
${ai.models.map(m => `- name: ${m.name}
  openSource: ${m.isOpenSource}
  api: ${m.isAPI}
  offline: ${m.offlineSupport}`).join('\n')}
\`\`\``

    if (ai.supportedLanguages?.length > 0) {
      content += `

### Supported Languages
\`\`\`
${ai.supportedLanguages.join(', ')}
\`\`\``
    }

    content += `

### Hardware Preference: ${ai.hardwarePreference}`

    return content
  }

  const generateDesktopSystemCapabilities = (state: WizardState): string => {
    const caps = state.desktopSystemCapabilities
    if (!caps) return ''

    const enabledCaps = Object.entries(caps)
      .filter(([_, v]) => v)
      .map(([k]) => k)

    if (enabledCaps.length === 0) return ''

    const labelMap: Record<string, string> = {
      fileSystemAccess: 'الوصول لنظام الملفات',
      microphone: 'الميكروفون',
      camera: 'الكاميرا',
      globalShortcuts: 'اختصارات لوحة المفاتيح',
      backgroundExecution: 'العمل في الخلفية',
      autoStart: 'التشغيل التلقائي'
    }

    return `## Desktop/System Capabilities | إمكانيات النظام

### Enabled Capabilities
\`\`\`yaml
${enabledCaps.map(c => `- ${labelMap[c] || c}`).join('\n')}
\`\`\``
  }

  // Generate Dependencies
  const generateDependencies = (state: WizardState): string => {
    const hasBackend = state.backendDependencies?.length > 0
    const hasFrontend = state.frontendDependencies?.length > 0

    if (!hasBackend && !hasFrontend) return ''

    const pm = state.packageManager || 'pnpm'
    const installCmd = pm === 'npm'
      ? 'npm install'
      : pm === 'yarn'
        ? 'yarn add'
        : pm === 'bun' ? 'bun add' : 'pnpm add'

    let content = `## Dependencies | المتطلبات

### Package Manager: ${pm}
`

    if (hasBackend) {
      content += `
### Backend Dependencies
\`\`\`bash
${installCmd} ${state.backendDependencies.join(' ')}
\`\`\`
\`\`\`json
{
  "dependencies": {
${state.backendDependencies.map(d => `    "${d}": "latest"`).join(',\n')}
  }
}
\`\`\``
    }

    if (hasFrontend) {
      content += `

### Frontend Dependencies
\`\`\`bash
${installCmd} ${state.frontendDependencies.join(' ')}
\`\`\`
\`\`\`json
{
  "dependencies": {
${state.frontendDependencies.map(d => `    "${d}": "latest"`).join(',\n')}
  }
}
\`\`\``
    }

    if (state.aiDependencies?.length > 0) {
      content += `

### AI Dependencies
\`\`\`bash
${installCmd} ${state.aiDependencies.join(' ')}
\`\`\``
    }

    if (state.systemDependencies?.length > 0) {
      content += `

### System Dependencies
\`\`\`bash
${installCmd} ${state.systemDependencies.join(' ')}
\`\`\``
    }

    if (state.buildDependencies?.length > 0) {
      content += `

### Build Dependencies
\`\`\`bash
${installCmd} -D ${state.buildDependencies.join(' ')}
\`\`\``
    }

    return content
  }

  // Generate Environment Variables
  const generateEnvironmentVariables = (state: WizardState): string => {
    let content = `## 12. Environment Variables | متغيرات البيئة

### .env
\`\`\`env\n`

    state.environmentVariables.forEach((env) => {
      content += `# ${env.description}${env.required ? ' (required)' : ''}\n`
      content += `${env.name}=${env.example}\n\n`
    })

    content += `\`\`\``

    if (state.seedData) {
      content += `

## 13. Seed Data | بيانات تجريبية
\`\`\`
${state.seedData}
\`\`\``
    }

    return content
  }

  // Generate Development Guidelines
  const generateDevelopmentGuidelines = (state: WizardState): string => {
    let content = `## Development Guidelines | إرشادات التطوير

### TypeScript Mode
\`\`\`
${state.useTypeScript === 'full' ? 'استخدم TypeScript في جميع الملفات' : 'استخدم JavaScript فقط (ما عدا ملفات *.config.ts)'}
\`\`\`
`

    if (state.developmentWarnings?.length) {
      const enabledWarnings = state.developmentWarnings.filter(w => w.enabled)
      if (enabledWarnings.length > 0) {
        content += `
### المحاذير والتأكيدات
\`\`\`
${enabledWarnings.map((w, i) => `${i + 1}. ${w.warning}`).join('\n')}
\`\`\``
      }
    }

    return content
  }

  // Generate full markdown
  const generateMarkdown = (state: WizardState): string => {
    const sections: string[] = []
    // Basic sections
    sections.push(generateQuickReference(state))
    sections.push(generateProjectOverview(state))
    sections.push(generateUserStories(state))

    // Permissions section (if enabled)
    const permissions = generatePermissionsSection(state)
    if (permissions) sections.push(permissions)

    sections.push(generateTechnicalRequirements(state))

    // AI Configuration section
    if (_needsAI(state)) {
      const aiSection = generateAIConfiguration(state)
      if (aiSection) sections.push(aiSection)
    }

    // Desktop/System Capabilities section
    if (_needsDesktopSystem(state)) {
      const desktopSection = generateDesktopSystemCapabilities(state)
      if (desktopSection) sections.push(desktopSection)
    }

    // External services section
    const externalServices = generateExternalServices(state)
    if (externalServices) sections.push(externalServices)

    // Database section (only if project needs database)
    if (_needsDatabase(state) && state.tables?.length > 0) {
      sections.push(generateDatabaseDesign(state))
    }

    // API section
    const apiSection = generateApiDesign(state)
    if (apiSection) sections.push(apiSection)

    // Frontend section (only if project needs frontend)
    const frontendSection = generateFrontendPages(state)
    if (frontendSection) sections.push(frontendSection)

    sections.push(generateFeaturesList(state))

    // Extended sections for medium/large
    if (state.projectSize !== 'small') {
      const wireframes = generateWireframes(state)
      if (wireframes) sections.push(wireframes)

      const edgeCases = generateEdgeCases(state)
      if (edgeCases) sections.push(edgeCases)

      const phases = generateImplementationPhases(state)
      if (phases) sections.push(phases)
    }

    const dependencies = generateDependencies(state)
    if (dependencies) sections.push(dependencies)

    sections.push(generateEnvironmentVariables(state))
    sections.push(generateDevelopmentGuidelines(state))

    return sections.filter(s => s.trim()).join('\n\n---\n\n')
  }

  // Download markdown file
  const downloadMarkdown = (state: WizardState) => {
    const content = generateMarkdown(state)
    const filename = state.projectNameTechnical || 'project-spec'

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    generateMarkdown,
    downloadMarkdown
  }
}
