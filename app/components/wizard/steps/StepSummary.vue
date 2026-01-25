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
  let markdown = `# ملخص المشروع للمناقشة مع AI

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

  markdown += `
---

## ${permissionsEnabled.value ? '4' : '3'}. التقنيات المختارة
`

  const ts = state.value.techStack
  if (ts.backend) markdown += `- **Backend:** ${ts.backend}\n`
  if (ts.frontend) markdown += `- **Frontend:** ${ts.frontend}\n`
  if (ts.database) markdown += `- **قاعدة البيانات:** ${ts.database}\n`
  if (ts.auth) markdown += `- **المصادقة:** ${ts.auth}\n`
  if (ts.runtime) markdown += `- **Runtime:** ${ts.runtime}\n`
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

## ملاحظة للـ AI
استخدم هذه المعلومات لمساعدتي في تصميم:
1. هيكل قاعدة البيانات المناسب
2. العلاقات بين الجداول
3. الفهارس المطلوبة
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
      title="ملخص للمناقشة مع AI"
      description="انسخ هذا الملخص وشاركه مع ChatGPT أو Claude لمناقشة تصميم قاعدة البيانات قبل المتابعة للخطوة التالية."
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
      description="بعد مناقشة الملخص مع AI، يمكنك الانتقال للخطوة التالية لتصميم قاعدة البيانات بناءً على التوصيات."
    />
  </div>
</template>
