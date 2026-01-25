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
    <div class="max-w-3xl mx-auto text-center space-y-8">
      <!-- Hero -->
      <div class="space-y-4">
        <UIcon name="i-lucide-file-code-2" class="w-20 h-20 mx-auto text-primary-500" />
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          معالج مواصفات المشروع
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          أنشئ ملف مواصفات مشروع متكامل وجاهز للاستخدام مع Claude Code في دقائق
        </p>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-zap" class="w-8 h-8 text-yellow-500" />
              <span class="font-semibold">سريع</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            9 خطوات بسيطة لإنشاء مواصفات كاملة لمشروعك
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-check-circle" class="w-8 h-8 text-green-500" />
              <span class="font-semibold">منظم</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            يغطي كل جوانب المشروع: قاعدة البيانات، API، الواجهة، والمزيد
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-download" class="w-8 h-8 text-blue-500" />
              <span class="font-semibold">قابل للتحميل</span>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            احصل على ملف Markdown جاهز للاستخدام فوراً
          </p>
        </UCard>
      </div>

      <!-- Steps Preview -->
      <UCard>
        <template #header>
          <span class="font-semibold">الخطوات</span>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
            <span>قاعدة البيانات</span>
          </div>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">5</UBadge>
            <span>الـ API</span>
          </div>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">6</UBadge>
            <span>الواجهة</span>
          </div>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">7</UBadge>
            <span>المميزات</span>
          </div>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">8</UBadge>
            <span>المتطلبات</span>
          </div>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">9</UBadge>
            <span>إرشادات التطوير</span>
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
      </div>

      <!-- Info -->
      <UAlert
        icon="i-lucide-info"
        color="primary"
        variant="subtle"
        title="ملاحظة"
        description="يتم حفظ بياناتك تلقائياً في قاعدة البيانات. يمكنك متابعة العمل من أي جهاز باستخدام رابط المشروع."
      />
    </div>
  </UContainer>
</template>
