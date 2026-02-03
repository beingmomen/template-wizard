<script setup>
const { createProject, currentProjectId } = useWizardState()
const isCreating = ref(false)

async function handleStartFresh() {
  isCreating.value = true
  try {
    const projectId = await createProject()
    if (projectId) {
      navigateTo(`/wizard/${projectId}`)
    }
  } finally {
    isCreating.value = false
  }
}

function handleContinue() {
  if (currentProjectId.value) {
    navigateTo(`/wizard/${currentProjectId.value}`)
  } else {
    navigateTo('/wizard')
  }
}
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-5xl mx-auto text-center space-y-8">
      <!-- Hero -->
      <div class="space-y-4">
        <UIcon name="i-lucide-file-code-2" class="w-20 h-20 mx-auto text-primary-500" />
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          معالج مواصفات المشروع
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          معالج تكيّفي يولّد مواصفات مشروع متكاملة لأي نوع تطبيق — جاهزة للاستخدام مع AI
        </p>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-settings-2" class="w-8 h-8 text-yellow-500" />
              <span class="font-semibold">معالج تكيّفي</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            14 خطوة ذكية تتكيف مع نوع مشروعك — تظهر فقط الخطوات المناسبة
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-layers" class="w-8 h-8 text-green-500" />
              <span class="font-semibold">كل أنواع المشاريع</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Fullstack, Frontend, Backend, CLI, Desktop, مكتبات, إضافات كروم, وتكامل
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-brain" class="w-8 h-8 text-purple-500" />
              <span class="font-semibold">دعم الذكاء الاصطناعي</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            إعدادات AI، نماذج محلية وسحابية، تفضيل العتاد، ودعم سطح المكتب والنظام
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-file-archive" class="w-8 h-8 text-blue-500" />
              <span class="font-semibold">تصدير متعدد</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Markdown, CLAUDE.md, AI Prompt, وملف ZIP كامل مع .mcp.json
          </p>
        </UCard>
      </div>

      <!-- Steps Preview -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold">خطوات المعالج</span>
            <UBadge color="primary" variant="subtle">14 خطوة</UBadge>
          </div>
        </template>
        <div class="space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-lock" class="w-4 h-4 text-primary-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">خطوات أساسية (تظهر دائماً)</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">1</UBadge>
                <span>نظرة عامة</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">2</UBadge>
                <span>قصص المستخدم</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">3</UBadge>
                <span>التقنيات</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">4</UBadge>
                <span>ملخص للمناقشة</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">5</UBadge>
                <span>المميزات</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">6</UBadge>
                <span>المتطلبات</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="subtle">7</UBadge>
                <span>إرشادات التطوير</span>
              </div>
            </div>
          </div>

          <USeparator />

          <div>
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-lucide-toggle-right" class="w-4 h-4 text-warning-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">خطوات شرطية (تظهر حسب نوع المشروع)</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-shield" class="w-3 h-3" />
                </UBadge>
                <span>الصلاحيات</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-database" class="w-3 h-3" />
                </UBadge>
                <span>قاعدة البيانات</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-file-text" class="w-3 h-3" />
                </UBadge>
                <span>ملخص مع DB</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-plug" class="w-3 h-3" />
                </UBadge>
                <span>واجهات التواصل</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-layout" class="w-3 h-3" />
                </UBadge>
                <span>الواجهة</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-brain" class="w-3 h-3" />
                </UBadge>
                <span>إعدادات الذكاء الاصطناعي</span>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="warning" variant="subtle">
                  <UIcon name="i-lucide-monitor" class="w-3 h-3" />
                </UBadge>
                <span>سطح المكتب والنظام</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">
              تظهر هذه الخطوات تلقائياً بناءً على نوع المشروع، بيئة التشغيل، مستوى الذكاء الاصطناعي، واختيارات التقنيات
            </p>
          </div>
        </div>
      </UCard>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton
          size="lg"
          :icon="isCreating ? 'i-lucide-loader-2' : 'i-lucide-play'"
          :class="{ 'animate-spin': isCreating }"
          :label="isCreating ? 'جارٍ الإنشاء...' : 'مشروع جديد'"
          :disabled="isCreating"
          @click="handleStartFresh"
        />
        <UButton
          v-if="currentProjectId"
          size="lg"
          variant="outline"
          icon="i-lucide-arrow-left"
          trailing
          label="متابعة المشروع الحالي"
          @click="handleContinue"
        />
        <UButton
          to="/projects"
          size="lg"
          variant="ghost"
          icon="i-lucide-folder-open"
          label="مشاريعي المحفوظة"
        />
        <UButton
          to="/methodology"
          size="lg"
          variant="ghost"
          icon="i-lucide-book-open"
          label="منهجية التطوير"
        />
        <UButton
          to="/changelog"
          size="lg"
          variant="ghost"
          icon="i-lucide-history"
          label="سجل التحديثات"
        />
      </div>

      <!-- Info -->
      <UAlert
        icon="i-lucide-info"
        color="primary"
        variant="subtle"
        title="ملاحظة"
        description="يتم حفظ بياناتك تلقائياً. المعالج يتكيف مع مشروعك ويُصدّر ملفات Markdown, CLAUDE.md, AI Prompt, وملف ZIP كامل."
      />
    </div>
  </UContainer>
</template>
