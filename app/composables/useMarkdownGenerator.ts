import type { WizardState, ProjectType } from '~/types/wizard.types'

const projectTypeLabels: Record<ProjectType, string> = {
  'fullstack': 'Fullstack Application',
  'frontend-only': 'Frontend Only',
  'backend-only': 'Backend/API Only',
  'chrome-extension': 'Chrome Extension',
  'cli-tool': 'CLI Tool',
  'library': 'Library/Package',
  'integration': 'Integration Service'
}

export function useMarkdownGenerator() {
  const needsFrontend = (projectType: ProjectType) =>
    ['fullstack', 'frontend-only', 'chrome-extension'].includes(projectType)

  const needsBackend = (projectType: ProjectType) =>
    ['fullstack', 'backend-only'].includes(projectType)

  const needsDatabase = (projectType: ProjectType) =>
    ['fullstack', 'backend-only'].includes(projectType)

  // Generate Quick Reference section
  const generateQuickReference = (state: WizardState): string => {
    const projectType = state.projectType || 'fullstack'
    let content = `# Project Specification: ${state.projectName}

## Quick Reference | مرجع سريع

| الحقل | القيمة |
|-------|--------|
| نوع المشروع | ${projectTypeLabels[projectType]} |
| حجم المشروع | ${state.projectSize === 'small' ? 'صغير' : state.projectSize === 'medium' ? 'متوسط' : 'كبير'} |
| الاسم التقني | ${state.projectNameTechnical} |
| البنية | ${state.architecture} |`

    if (state.techStack.frontend) content += `\n| Frontend | ${state.techStack.frontend} |`
    if (state.techStack.backend) content += `\n| Backend | ${state.techStack.backend} |`
    if (state.techStack.database) content += `\n| Database | ${state.techStack.database} |`
    if (state.techStack.auth) content += `\n| Auth | ${state.techStack.auth} |`
    if (state.techStack.runtime) content += `\n| Runtime | ${state.techStack.runtime} |`
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
- اللغة: ${state.primaryLanguage === 'ar' ? 'عربي' : state.primaryLanguage === 'en' ? 'إنجليزي' : 'كلاهما'}
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
    let techStackLines = []
    if (state.techStack.frontend) techStackLines.push(`Frontend: ${state.techStack.frontend}`)
    if (state.techStack.backend) techStackLines.push(`Backend: ${state.techStack.backend}`)
    if (state.techStack.database) techStackLines.push(`Database: ${state.techStack.database}`)
    if (state.techStack.auth) techStackLines.push(`Authentication: ${state.techStack.auth}`)
    if (state.techStack.runtime) techStackLines.push(`Runtime: ${state.techStack.runtime}`)
    if (state.techStack.orm) techStackLines.push(`ORM: ${state.techStack.orm}`)
    if (state.techStack.fileUpload) techStackLines.push(`File Upload: ${state.techStack.fileUpload}`)
    if (state.techStack.pdfGeneration) techStackLines.push(`PDF Generation: ${state.techStack.pdfGeneration}`)
    if (state.techStack.email) techStackLines.push(`Email: ${state.techStack.email}`)

    let content = `## Technical Requirements | المتطلبات التقنية

### Tech Stack
\`\`\`yaml
${techStackLines.join('\n')}
\`\`\`

### Architecture
\`\`\`
البنية: ${state.architecture === 'monolith' ? 'Monolith - تطبيق واحد' : state.architecture === 'monorepo' ? 'Monorepo - عدة تطبيقات' : 'Microservices - خدمات منفصلة'}
\`\`\``

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
        const type = col.type === 'string' ? 'VARCHAR(255)' :
                     col.type === 'number' ? 'INT' :
                     col.type === 'decimal' ? 'DECIMAL(10,2)' :
                     col.type === 'boolean' ? 'BOOLEAN' :
                     col.type === 'date' ? 'TIMESTAMP' :
                     col.type === 'uuid' ? 'CHAR(36)' :
                     col.type === 'json' ? 'JSON' : 'TEXT'

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
    if (!state.pages?.length && !state.sharedComponents) return ''

    let content = `## Frontend Pages | صفحات الواجهة

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

    if (state.sharedComponents) {
      content += `

### Shared Components
\`\`\`
${state.sharedComponents}
\`\`\``
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

  // Generate Dependencies
  const generateDependencies = (state: WizardState): string => {
    const hasBackend = state.backendDependencies?.length > 0
    const hasFrontend = state.frontendDependencies?.length > 0

    if (!hasBackend && !hasFrontend) return ''

    const pm = state.packageManager || 'pnpm'
    const installCmd = pm === 'npm' ? 'npm install' :
                       pm === 'yarn' ? 'yarn add' :
                       pm === 'bun' ? 'bun add' : 'pnpm add'

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
      content += `
### المحاذير والتأكيدات
\`\`\`
${state.developmentWarnings.map((w, i) => `${i + 1}. ${w.warning}`).join('\n')}
\`\`\``
    }

    return content
  }

  // Generate full markdown
  const generateMarkdown = (state: WizardState): string => {
    const sections: string[] = []
    const projectType = state.projectType || 'fullstack'

    // Basic sections
    sections.push(generateQuickReference(state))
    sections.push(generateProjectOverview(state))
    sections.push(generateUserStories(state))

    // Permissions section (if enabled)
    const permissions = generatePermissionsSection(state)
    if (permissions) sections.push(permissions)

    sections.push(generateTechnicalRequirements(state))

    // External services section
    const externalServices = generateExternalServices(state)
    if (externalServices) sections.push(externalServices)

    // Database section (only if project needs database)
    if (needsDatabase(projectType) && state.tables?.length > 0) {
      sections.push(generateDatabaseDesign(state))
    }

    // API section (only if project needs backend)
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
