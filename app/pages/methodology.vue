<script setup>
const phases = [
  {
    id: 1,
    name: 'الاكتشاف والتحليل',
    nameEn: 'Discovery Phase',
    icon: 'i-lucide-search',
    coverage: 75,
    color: 'primary',
    description: 'فهم المشكلة والمستخدمين وجمع المتطلبات',
    steps: [
      'جمع المتطلبات (Requirements Gathering)',
      'دراسة الجدوى (Feasibility Study)',
      'إثبات المفهوم - POC (Proof of Concept)'
    ],
    covered: [
      'المشكلة والحل',
      'المستخدمين المستهدفين',
      'User Stories',
      'نوع المشروع وحجمه'
    ],
    missing: [
      'دراسة السوق والمنافسين',
      'Assumptions & Risks',
      'تحليل الجدوى المالية'
    ]
  },
  {
    id: 2,
    name: 'التخطيط والتصميم',
    nameEn: 'Planning & Design',
    icon: 'i-lucide-pencil-ruler',
    coverage: 85,
    color: 'success',
    description: 'تصميم البنية التقنية وواجهة المستخدم',
    steps: [
      'تصميم البنية التقنية (Architecture Design)',
      'تصميم واجهة المستخدم (UI/UX Design)',
      'التخطيط للمشروع (Project Planning)'
    ],
    covered: [
      'Tech Stack كامل',
      'Architecture (Monolith/Microservices)',
      'Database Schema',
      'API Design',
      'الصلاحيات والأدوار',
      'Multi-tenancy'
    ],
    missing: [
      'UI/UX Specifications التفصيلية',
      'توثيق API (Swagger/OpenAPI)'
    ]
  },
  {
    id: 3,
    name: 'بناء MVP',
    nameEn: 'MVP Development',
    icon: 'i-lucide-code',
    coverage: 90,
    color: 'success',
    description: 'تطوير النسخة الأولى بالميزات الأساسية',
    steps: [
      'تطوير MVP (Minimum Viable Product)',
      'ممارسات التطوير الأساسية',
      'الإصدار Alpha'
    ],
    covered: [
      'MVP Features',
      'Future Features',
      'Dependencies (Backend/Frontend)',
      'Environment Variables',
      'Implementation Phases',
      'Edge Cases',
      'Development Guidelines'
    ],
    missing: [
      'Branching Strategy'
    ]
  },
  {
    id: 4,
    name: 'الاختبار والتحسين',
    nameEn: 'Testing & QA',
    icon: 'i-lucide-test-tube',
    coverage: 0,
    color: 'error',
    description: 'اختبار المنتج وضمان الجودة',
    steps: [
      'الإصدار Beta',
      'Unit/Integration Testing',
      'Performance Testing',
      'Security Testing',
      'UAT (User Acceptance Testing)'
    ],
    covered: [],
    missing: [
      'استراتيجية الاختبار',
      'Test Cases',
      'Acceptance Criteria',
      'معايير الجودة',
      'Performance Benchmarks'
    ]
  },
  {
    id: 5,
    name: 'الإطلاق',
    nameEn: 'Production Launch',
    icon: 'i-lucide-rocket',
    coverage: 0,
    color: 'error',
    description: 'نشر المنتج وإطلاقه للمستخدمين',
    steps: [
      'التجهيز للإطلاق',
      'استراتيجية الإطلاق',
      'Soft Launch / Phased Rollout'
    ],
    covered: [],
    missing: [
      'منصة الاستضافة (Hosting)',
      'CI/CD Pipeline',
      'Domain & SSL',
      'Monitoring & Logging',
      'Disaster Recovery Plan'
    ]
  },
  {
    id: 6,
    name: 'التوسع للملايين',
    nameEn: 'Scaling',
    icon: 'i-lucide-trending-up',
    coverage: 5,
    color: 'error',
    description: 'توسيع النظام لخدمة ملايين المستخدمين',
    steps: [
      'البنية التحتية القابلة للتوسع',
      'المراقبة والصيانة',
      'التطوير المستمر'
    ],
    covered: [
      'Multi-tenancy Support'
    ],
    missing: [
      'Performance Requirements',
      'Scalability Plan',
      'Caching Strategy',
      'Load Balancing',
      'Security Requirements (OWASP)',
      'Analytics & Monitoring'
    ]
  }
]

const missingFeatures = [
  {
    title: 'قسم الاختبار',
    icon: 'i-lucide-test-tube',
    color: 'error',
    items: ['استراتيجية الاختبار', 'Test Cases', 'Acceptance Criteria', 'معايير الجودة']
  },
  {
    title: 'قسم النشر',
    icon: 'i-lucide-cloud-upload',
    color: 'warning',
    items: ['منصة الاستضافة', 'CI/CD Pipeline', 'Domain & SSL']
  },
  {
    title: 'قسم الأداء',
    icon: 'i-lucide-gauge',
    color: 'info',
    items: ['عدد المستخدمين المتوقع', 'Response Time', 'Caching Strategy']
  },
  {
    title: 'قسم الأمان',
    icon: 'i-lucide-shield',
    color: 'error',
    items: ['OWASP Top 10', 'Data Encryption', 'Rate Limiting']
  },
  {
    title: 'قسم المراقبة',
    icon: 'i-lucide-activity',
    color: 'warning',
    items: ['Error Tracking', 'Logging', 'Analytics']
  },
  {
    title: 'قسم التحليل',
    icon: 'i-lucide-bar-chart',
    color: 'info',
    items: ['تحليل المنافسين', 'Risks & Mitigation', 'Assumptions']
  }
]

const totalCoverage = computed(() => {
  const sum = phases.reduce((acc, phase) => acc + phase.coverage, 0)
  return Math.round(sum / phases.length)
})

const expandedPhases = ref([])

function togglePhase(phaseId) {
  const index = expandedPhases.value.indexOf(phaseId)
  if (index === -1) {
    expandedPhases.value.push(phaseId)
  } else {
    expandedPhases.value.splice(index, 1)
  }
}

function isExpanded(phaseId) {
  return expandedPhases.value.includes(phaseId)
}

function getProgressColor(coverage) {
  if (coverage >= 80) return 'success'
  if (coverage >= 50) return 'warning'
  return 'error'
}

const githubRepo = 'beingmomen/template-wizard'

function createGitHubIssueUrl(type, title, body) {
  const labels = {
    feature: 'enhancement',
    bug: 'bug',
    enhancement: 'enhancement'
  }
  const baseUrl = `https://github.com/${githubRepo}/issues/new`
  const params = new URLSearchParams({
    title,
    body,
    labels: labels[type] || ''
  })
  return `${baseUrl}?${params.toString()}`
}

function openFeatureRequest(featureName, phaseName) {
  const title = `[Feature Request] إضافة: ${featureName}`
  const body = `## الوصف
إضافة دعم لـ "${featureName}" في الـ Wizard.

## السبب
هذه الميزة مطلوبة لتحسين تغطية الـ Wizard للمشاريع الاحترافية.

## المرحلة المتعلقة
${phaseName}

## معلومات إضافية
<!-- أضف أي تفاصيل إضافية هنا -->`
  window.open(createGitHubIssueUrl('feature', title, body), '_blank')
}

function openSectionRequest(sectionTitle, items) {
  const title = `[Feature Request] إضافة قسم: ${sectionTitle}`
  const body = `## الوصف
إضافة قسم "${sectionTitle}" للـ Wizard.

## العناصر المطلوبة
${items.map(item => `- [ ] ${item}`).join('\n')}

## السبب
هذا القسم مطلوب لتحسين تغطية الـ Wizard للمشاريع الاحترافية.

## معلومات إضافية
<!-- أضف أي تفاصيل إضافية هنا -->`
  window.open(createGitHubIssueUrl('feature', title, body), '_blank')
}

function openGeneralIssue(type) {
  const templates = {
    feature: {
      title: '[Feature Request] ',
      body: `## الوصف
<!-- صف الميزة المطلوبة -->

## السبب
<!-- لماذا هذه الميزة مفيدة؟ -->

## معلومات إضافية
<!-- أضف أي تفاصيل إضافية هنا -->`
    },
    enhancement: {
      title: '[Enhancement] ',
      body: `## الميزة الحالية
<!-- صف الميزة الموجودة -->

## التحسين المقترح
<!-- صف التحسين المطلوب -->

## الفائدة
<!-- لماذا هذا التحسين مفيد؟ -->

## معلومات إضافية
<!-- أضف أي تفاصيل إضافية هنا -->`
    },
    bug: {
      title: '[Bug] ',
      body: `## وصف المشكلة
<!-- صف المشكلة بوضوح -->

## خطوات إعادة الإنتاج
1.
2.
3.

## السلوك المتوقع
<!-- ما كان يجب أن يحدث -->

## السلوك الفعلي
<!-- ما حدث فعلاً -->

## معلومات البيئة
- المتصفح:
- نظام التشغيل:

## معلومات إضافية
<!-- أضف أي تفاصيل إضافية هنا -->`
    }
  }
  const template = templates[type]
  window.open(createGitHubIssueUrl(type, template.title, template.body), '_blank')
}
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Hero Section -->
      <div class="text-center space-y-4">
        <UIcon name="i-lucide-book-open" class="w-16 h-16 mx-auto text-primary-500" />
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          منهجية تطوير المشاريع الاحترافية
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          الخطوات الكاملة لبناء مشروع برمجي من الفكرة إلى منتج يخدم الملايين
        </p>
        <UButton
          to="/"
          variant="ghost"
          icon="i-lucide-arrow-right"
          trailing
          label="العودة للرئيسية"
        />
      </div>

      <!-- Overall Coverage Summary -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-lg">تغطية الـ Wizard الحالية</span>
            <UBadge :color="getProgressColor(totalCoverage)" size="lg">
              {{ totalCoverage }}%
            </UBadge>
          </div>
        </template>
        <div class="space-y-4">
          <UProgress :model-value="totalCoverage" :color="getProgressColor(totalCoverage)" size="lg" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            الـ Wizard يغطي حالياً <strong>{{ totalCoverage }}%</strong> من متطلبات المشاريع الاحترافية.
            يركز بشكل أساسي على مراحل التخطيط والتصميم وبناء MVP، بينما تحتاج مراحل الاختبار والنشر والتوسع إلى تغطية أكبر.
          </p>
        </div>
      </UCard>

      <!-- Phases Section -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          الـ 6 مراحل الأساسية للتطوير
        </h2>

        <div class="space-y-3">
          <UCard
            v-for="phase in phases"
            :key="phase.id"
            class="cursor-pointer transition-all hover:ring-2 hover:ring-primary-500/50"
            @click="togglePhase(phase.id)"
          >
            <!-- Phase Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30': phase.coverage >= 80,
                    'bg-yellow-100 dark:bg-yellow-900/30': phase.coverage >= 50 && phase.coverage < 80,
                    'bg-red-100 dark:bg-red-900/30': phase.coverage < 50
                  }"
                >
                  <UIcon
                    :name="phase.icon"
                    class="w-6 h-6"
                    :class="{
                      'text-green-500': phase.coverage >= 80,
                      'text-yellow-500': phase.coverage >= 50 && phase.coverage < 80,
                      'text-red-500': phase.coverage < 50
                    }"
                  />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ phase.id }}. {{ phase.name }}
                    </span>
                    <UBadge variant="subtle" size="xs">{{ phase.nameEn }}</UBadge>
                  </div>
                  <p class="text-sm text-gray-500">{{ phase.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-left w-20">
                  <UProgress :model-value="phase.coverage" :color="getProgressColor(phase.coverage)" size="sm" />
                  <p class="text-xs text-gray-500 mt-1">{{ phase.coverage }}%</p>
                </div>
                <UIcon
                  :name="isExpanded(phase.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-5 h-5 text-gray-400"
                />
              </div>
            </div>

            <!-- Expanded Content -->
            <div v-if="isExpanded(phase.id)" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="grid md:grid-cols-3 gap-6">
                <!-- Steps -->
                <div>
                  <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-list" class="w-4 h-4" />
                    الخطوات
                  </h4>
                  <ul class="space-y-2 text-sm">
                    <li v-for="step in phase.steps" :key="step" class="flex items-start gap-2">
                      <UIcon name="i-lucide-circle" class="w-3 h-3 mt-1.5 text-gray-400" />
                      <span class="text-gray-600 dark:text-gray-400">{{ step }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Covered -->
                <div>
                  <h4 class="font-medium text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                    ما يغطيه الـ Wizard
                  </h4>
                  <ul v-if="phase.covered.length" class="space-y-2 text-sm">
                    <li v-for="item in phase.covered" :key="item" class="flex items-start gap-2">
                      <UIcon name="i-lucide-check" class="w-4 h-4 mt-0.5 text-green-500" />
                      <span class="text-gray-600 dark:text-gray-400">{{ item }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-sm text-gray-400 italic">لا يوجد تغطية حالياً</p>
                </div>

                <!-- Missing -->
                <div>
                  <h4 class="font-medium text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                    <UIcon name="i-lucide-x-circle" class="w-4 h-4" />
                    ما ينقص
                  </h4>
                  <ul v-if="phase.missing.length" class="space-y-2 text-sm">
                    <li v-for="item in phase.missing" :key="item" class="flex items-center justify-between gap-2 group">
                      <div class="flex items-start gap-2">
                        <UIcon name="i-lucide-x" class="w-4 h-4 mt-0.5 text-red-500" />
                        <span class="text-gray-600 dark:text-gray-400">{{ item }}</span>
                      </div>
                      <UButton
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        icon="i-lucide-github"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="طلب هذه الميزة على GitHub"
                        @click.stop="openFeatureRequest(item, phase.name)"
                      />
                    </li>
                  </ul>
                  <p v-else class="text-sm text-green-500">تغطية كاملة!</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Missing Features Section -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          الأقسام المقترح إضافتها للـ Wizard
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          لتحويل الـ Wizard إلى أداة شاملة للمشاريع الاحترافية، يُنصح بإضافة الأقسام التالية:
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="feature in missingFeatures" :key="feature.title">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon :name="feature.icon" class="w-6 h-6" :class="{
                    'text-red-500': feature.color === 'error',
                    'text-yellow-500': feature.color === 'warning',
                    'text-blue-500': feature.color === 'info'
                  }" />
                  <span class="font-semibold">{{ feature.title }}</span>
                </div>
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-github"
                  title="طلب هذا القسم على GitHub"
                  @click="openSectionRequest(feature.title, feature.items)"
                />
              </div>
            </template>
            <ul class="space-y-2 text-sm">
              <li v-for="item in feature.items" :key="item" class="flex items-center gap-2">
                <UIcon name="i-lucide-plus" class="w-3 h-3 text-gray-400" />
                <span class="text-gray-600 dark:text-gray-400">{{ item }}</span>
              </li>
            </ul>
          </UCard>
        </div>
      </div>

      <!-- Real World Examples -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-building" class="w-6 h-6 text-primary-500" />
            <span class="font-semibold text-lg">أمثلة واقعية</span>
          </div>
        </template>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <h4 class="font-medium text-gray-900 dark:text-white">Uber</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              بدأت كخدمة SMS بسيطة في سان فرانسيسكو فقط، ثم توسعت تدريجياً بناءً على التغذية الراجعة من المستخدمين.
            </p>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium text-gray-900 dark:text-white">Netflix</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              تعتمد على CI/CD يسمح بآلاف التحديثات يومياً دون تأثير على المستخدمين، مما ساعدها في التحول من تأجير DVD إلى منصة بث عالمية.
            </p>
          </div>
        </div>
      </UCard>

      <!-- GitHub Contribute Section -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-simple-icons-github" class="w-6 h-6" />
            <span class="font-semibold text-lg">ساهم في تحسين الـ Wizard</span>
          </div>
        </template>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          هل لديك اقتراح أو وجدت مشكلة؟ ساعدنا في تحسين الـ Wizard عبر إنشاء Issue على GitHub.
        </p>
        <div class="grid sm:grid-cols-3 gap-4">
          <UButton
            block
            variant="outline"
            icon="i-lucide-lightbulb"
            color="success"
            label="طلب ميزة جديدة"
            @click="openGeneralIssue('feature')"
          />
          <UButton
            block
            variant="outline"
            icon="i-lucide-sparkles"
            color="primary"
            label="اقتراح تحسين"
            @click="openGeneralIssue('enhancement')"
          />
          <UButton
            block
            variant="outline"
            icon="i-lucide-bug"
            color="error"
            label="الإبلاغ عن مشكلة"
            @click="openGeneralIssue('bug')"
          />
        </div>
      </UCard>

      <!-- CTA Section -->
      <div class="text-center space-y-4">
        <UAlert
          icon="i-lucide-lightbulb"
          color="primary"
          variant="subtle"
          title="ملاحظة"
          description="الـ Wizard الحالي ممتاز لمرحلة MVP والتخطيط الأولي. للمشاريع الكبيرة، يُنصح بإضافة الأقسام الناقصة لضمان تغطية شاملة."
        />
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            to="/"
            size="lg"
            icon="i-lucide-home"
            label="الصفحة الرئيسية"
          />
          <UButton
            to="/projects"
            size="lg"
            variant="outline"
            icon="i-lucide-folder-open"
            label="مشاريعي"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>
