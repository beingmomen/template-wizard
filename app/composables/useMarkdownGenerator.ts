import type { WizardState } from '~/types/wizard.types'

export function useMarkdownGenerator() {
  // Generate Quick Reference section
  const generateQuickReference = (state: WizardState): string => {
    return `# Project Specification: ${state.projectName}

## Quick Reference | مرجع سريع

| الحقل | القيمة |
|-------|--------|
| حجم المشروع | ${state.projectSize === 'small' ? 'صغير' : state.projectSize === 'medium' ? 'متوسط' : 'كبير'} |
| الاسم التقني | ${state.projectNameTechnical} |
| البنية | ${state.architecture} |
| Frontend | ${state.techStack.frontend} |
| Backend | ${state.techStack.backend} |
| Database | ${state.techStack.database} |
| Auth | ${state.techStack.auth} |
${state.multiTenancy.enabled ? `| Multi-tenancy | ${state.multiTenancy.model} (${state.multiTenancy.isolationLevel}) |` : ''}`
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

    state.userTypes.forEach((ut, i) => {
      content += `### 2.${i + 1} ${ut.userType}\n\`\`\`\n`
      ut.stories.forEach((s) => {
        content += `- ${s.story}\n`
      })
      content += `\`\`\`\n\n`
    })

    return content
  }

  // Generate Technical Requirements
  const generateTechnicalRequirements = (state: WizardState): string => {
    let content = `## 3. Technical Requirements | المتطلبات التقنية

### 3.1 Tech Stack
\`\`\`yaml
Frontend: ${state.techStack.frontend}
Backend: ${state.techStack.backend}
Database: ${state.techStack.database}
Authentication: ${state.techStack.auth}
${state.techStack.orm ? `ORM: ${state.techStack.orm}` : ''}
${state.techStack.fileUpload ? `File Upload: ${state.techStack.fileUpload}` : ''}
${state.techStack.pdfGeneration ? `PDF Generation: ${state.techStack.pdfGeneration}` : ''}
${state.techStack.email ? `Email: ${state.techStack.email}` : ''}
\`\`\`

### 3.2 Architecture
\`\`\`
البنية: ${state.architecture === 'monolith' ? 'Monolith - تطبيق واحد' : state.architecture === 'monorepo' ? 'Monorepo - عدة تطبيقات' : 'Microservices - خدمات منفصلة'}
\`\`\``

    if (state.multiTenancy.enabled) {
      content += `

### 3.3 Multi-tenancy
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
    let content = `## 5. API Design | تصميم الـ API

### 5.1 API Style: ${state.apiStyle}
${state.routePrefix ? `Base Prefix: ${state.routePrefix}` : ''}

### 5.2 Endpoints
\`\`\`yaml\n`

    state.endpoints.forEach((ep) => {
      content += `${ep.method} ${ep.path}:
  description: ${ep.description}
  auth: ${ep.authRequired ? 'required' : 'none'}
${ep.body ? `  body: ${ep.body}` : ''}
${ep.response ? `  response: ${ep.response}` : ''}

`
    })

    content += `\`\`\``
    return content
  }

  // Generate Frontend Pages
  const generateFrontendPages = (state: WizardState): string => {
    let content = `## 6. Frontend Pages | صفحات الواجهة

### 6.1 Pages List
\`\`\`yaml\n`

    state.pages.forEach((page) => {
      content += `${page.path}:
  name: ${page.name}
  description: ${page.description}
  auth: ${page.auth ? 'required' : 'public'}

`
    })

    content += `\`\`\``

    if (state.sharedComponents) {
      content += `

### 6.2 Shared Components
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
    return `## 11. Dependencies | المتطلبات

### 11.1 Backend Dependencies
\`\`\`json
{
  "dependencies": {
${state.backendDependencies.map(d => `    "${d}": "latest"`).join(',\n')}
  }
}
\`\`\`

### 11.2 Frontend Dependencies
\`\`\`json
{
  "dependencies": {
${state.frontendDependencies.map(d => `    "${d}": "latest"`).join(',\n')}
  }
}
\`\`\``
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

    // Basic sections
    sections.push(generateQuickReference(state))
    sections.push(generateProjectOverview(state))
    sections.push(generateUserStories(state))
    sections.push(generateTechnicalRequirements(state))
    sections.push(generateDatabaseDesign(state))
    sections.push(generateApiDesign(state))
    sections.push(generateFrontendPages(state))
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

    sections.push(generateDependencies(state))
    sections.push(generateEnvironmentVariables(state))
    sections.push(generateDevelopmentGuidelines(state))

    return sections.join('\n\n---\n\n')
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
