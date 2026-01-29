<script setup>
const { state } = useWizardState()
const copied = ref(false)

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const permissionsEnabled = computed(() => state.value.permissionsConfig?.enabled)

const summaryMarkdown = computed(() => {
  let markdown = `# ملخص المشروع للمناقشة مع AI (مع قاعدة البيانات)

## 1. معلومات المشروع الأساسية
- **اسم المشروع:** ${state.value.projectName || '(غير محدد)'}
- **الاسم التقني:** ${state.value.projectNameTechnical || '(غير محدد)'}
- **نوع المشروع:** ${getProjectTypeLabel(state.value.projectType)}
- **حجم المشروع:** ${getProjectSizeLabel(state.value.projectSize)}
- **اللغة الأساسية:** ${state.value.primaryLanguage === 'ar' ? 'العربية' : 'الإنجليزية'}

### المشكلة
${state.value.problemStatement || '(غير محدد)'}

### الحل المقترح
${state.value.solutionDescription || '(غير محدد)'}

### المستخدمون المستهدفون
${state.value.targetUsers || '(غير محدد)'}
- **نوع المستخدم:** ${getTargetUserTypeLabel(state.value.targetUserType)}
- **مستوى المستخدم:** ${getTargetUserLevelLabel(state.value.targetUserLevel)}

---

## 2. قصص المستخدمين
`

  if (state.value.userTypes?.length > 0) {
    state.value.userTypes.forEach((userType) => {
      if (userType.userType) {
        markdown += `\n### ${userType.userType}\n`
        if (userType.stories?.length > 0) {
          userType.stories.forEach((story) => {
            if (story.story) {
              markdown += `- ${story.story}\n`
            }
          })
        }
      }
    })
  } else {
    markdown += '(لا توجد قصص مستخدمين)\n'
  }

  if (permissionsEnabled.value) {
    markdown += `
---

## 3. الصلاحيات والأدوار

### نوع نظام الصلاحيات
${getPermissionSystemTypeLabel(state.value.permissionsConfig?.type)}
`

    if (state.value.roles?.length > 0) {
      markdown += '\n### الأدوار\n'
      markdown += '| الدور | الوصف |\n'
      markdown += '|-------|-------|\n'
      state.value.roles.forEach((role) => {
        markdown += `| ${role.name} | ${role.description || '-'} |\n`
      })
    }

    if (state.value.permissions?.length > 0) {
      markdown += '\n### الصلاحيات\n'
      markdown += '| الصلاحية | المورد | الإجراء | الوصف |\n'
      markdown += '|----------|--------|--------|-------|\n'
      state.value.permissions.forEach((perm) => {
        markdown += `| ${perm.name} | ${perm.resource} | ${perm.action} | ${perm.description || '-'} |\n`
      })
    }
  }

  const sectionNum = permissionsEnabled.value ? 4 : 3

  markdown += `
---

## ${sectionNum}. التقنيات المختارة
`

  const ts = state.value.techStack
  const tv = state.value.techVersions
  if (ts.backend) markdown += `- **Backend:** ${formatTechWithVersion(tv, ts.backend)}\n`
  if (ts.frontend) markdown += `- **Frontend:** ${formatTechWithVersion(tv, ts.frontend)}\n`
  if (ts.database) markdown += `- **قاعدة البيانات:** ${formatTechWithVersion(tv, ts.database)}\n`
  if (ts.auth) markdown += `- **المصادقة:** ${ts.auth}\n`
  if (ts.runtime) markdown += `- **Runtime:** ${formatTechWithVersion(tv, ts.runtime)}\n`
  if (ts.orm) markdown += `- **ORM:** ${ts.orm}\n`

  markdown += `
### المعمارية
- **النمط:** ${getArchitectureLabel(state.value.architecture)}
- **Multi-tenancy:** ${state.value.multiTenancy?.enabled ? 'نعم' : 'لا'}
`

  if (state.value.multiTenancy?.enabled) {
    markdown += `  - **نموذج التفريق:** ${state.value.multiTenancy.model || '-'}\n`
    markdown += `  - **مستوى العزل:** ${state.value.multiTenancy.isolationLevel || '-'}\n`
  }

  if (state.value.externalServices?.length > 0) {
    markdown += '\n### الخدمات الخارجية\n'
    state.value.externalServices.forEach((service) => {
      markdown += `- **${service.name}** (${service.type}): ${service.description}\n`
      if (service.envVars?.length > 0) {
        markdown += `  - متغيرات البيئة: ${service.envVars.join(', ')}\n`
      }
    })
  }

  markdown += `
---

## ${sectionNum + 1}. قاعدة البيانات

### الجداول
`

  if (state.value.tables?.length > 0) {
    state.value.tables.forEach((table) => {
      markdown += `\n#### جدول: ${table.tableName || '(بدون اسم)'}\n`
      if (table.description) {
        markdown += `${table.description}\n`
      }
      markdown += '\n| العمود | النوع | القيود | القيمة الافتراضية |\n'
      markdown += '|--------|-------|--------|------------------|\n'

      table.columns?.forEach((col) => {
        const constraints = col.constraints?.join(', ') || '-'
        const defaultVal = col.defaultValue || '-'
        markdown += `| ${col.name} | ${col.type} | ${constraints} | ${defaultVal} |\n`

        if (col.foreignKey?.relatedTable) {
          markdown += `|  | ↳ FK → ${col.foreignKey.relatedTable} (${getRelationshipLabel(col.foreignKey.relationshipType)}) |  |  |\n`
        }
      })
    })
  } else {
    markdown += '(لا توجد جداول)\n'
  }

  const relationships = []
  state.value.tables?.forEach((table) => {
    table.columns?.forEach((col) => {
      if (col.foreignKey?.relatedTable) {
        relationships.push({
          from: `${table.tableName}.${col.name}`,
          to: `${col.foreignKey.relatedTable}.id`,
          type: col.foreignKey.relationshipType
        })
      }
    })
  })

  if (relationships.length > 0) {
    markdown += '\n### العلاقات بين الجداول\n'
    markdown += '```\n'
    relationships.forEach((rel) => {
      markdown += `${rel.from} → ${rel.to} (${getRelationshipLabel(rel.type)})\n`
    })
    markdown += '```\n'
  }

  markdown += `
---

## ملاحظة للـ AI
استخدم هذه المعلومات لمساعدتي في تصميم:
1. الـ API endpoints المناسبة
2. صفحات الواجهة الأمامية
3. التحقق من اكتمال وصحة تصميم قاعدة البيانات
4. أي اعتبارات أمنية أو أداء
`

  return markdown
})

function getProjectTypeLabel(type) {
  const labels = {
    'fullstack': 'Full-stack (Frontend + Backend)',
    'frontend-only': 'Frontend فقط',
    'backend-only': 'Backend فقط',
    'chrome-extension': 'Chrome Extension',
    'cli-tool': 'CLI Tool',
    'library': 'Library/Package',
    'integration': 'Integration/API'
  }
  return labels[type] || type
}

function getProjectSizeLabel(size) {
  const labels = {
    'small': 'صغير',
    'medium': 'متوسط',
    'large': 'كبير'
  }
  return labels[size] || size
}

function getTargetUserTypeLabel(type) {
  const labels = {
    'developers': 'مطورين',
    'non-technical': 'غير تقنيين',
    'both': 'كلاهما'
  }
  return labels[type] || type
}

function getTargetUserLevelLabel(level) {
  const labels = {
    'beginner': 'مبتدئ',
    'intermediate': 'متوسط',
    'advanced': 'متقدم'
  }
  return labels[level] || level
}

function getPermissionSystemTypeLabel(type) {
  const labels = {
    'role-based': 'Role-Based (RBAC)',
    'action-based': 'Action-Based',
    'resource-based': 'Resource-Based',
    'custom': 'مخصص'
  }
  return labels[type] || type
}

function getArchitectureLabel(arch) {
  const labels = {
    'monolith': 'Monolith',
    'monorepo': 'Monorepo',
    'microservices': 'Microservices'
  }
  return labels[arch] || arch
}

function getRelationshipLabel(type) {
  const labels = {
    'one-to-one': '1:1',
    'one-to-many': '1:N',
    'many-to-many': 'N:N'
  }
  return labels[type] || type
}

function handleCopy() {
  copy(summaryMarkdown.value)
}
</script>

<template>
  <div class="space-y-6">
    <UAlert
      icon="i-lucide-info"
      color="primary"
      variant="subtle"
      title="ملخص شامل للمناقشة مع AI"
      description="يتضمن هذا الملخص جميع البيانات السابقة بما في ذلك تصميم قاعدة البيانات. انسخه وشاركه مع ChatGPT أو Claude لمناقشة تصميم الـ API والواجهة."
    />

    <div class="flex justify-end">
      <UButton
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        :color="copied ? 'success' : 'primary'"
        variant="soft"
        @click="handleCopy"
      >
        {{ copied ? 'تم النسخ!' : 'نسخ الملخص' }}
      </UButton>
    </div>

    <div class="relative">
      <pre
        class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-auto max-h-[500px] text-sm font-mono whitespace-pre-wrap"
        dir="auto"
      ><code>{{ summaryMarkdown }}</code></pre>
    </div>

    <UAlert
      icon="i-lucide-lightbulb"
      color="warning"
      variant="subtle"
      title="نصيحة"
      description="بعد مناقشة الملخص مع AI، يمكنك الانتقال للخطوة التالية لتصميم الـ API بناءً على التوصيات."
    />
  </div>
</template>
