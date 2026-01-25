<script setup>
const { state, currentStep, visibleSteps, isFirstStep, isLastStep, nextStep, prevStep, isAutoSaving, lastSaved, currentProjectId, updateField, deleteProject, softDeleteProject } = useWizardState()
const { validateStep } = useStepValidation()
const { downloadMarkdown } = useMarkdownGenerator()
const toast = useToast()

const stepperItems = computed(() =>
  visibleSteps.value.map(step => ({
    title: step.titleAr,
    icon: step.icon,
    value: String(step.id)
  }))
)

const validationErrors = ref([])
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const isHardDelete = computed(() => state.value.projectStatus === 'planning')

const projectUrl = computed(() => {
  if (!currentProjectId.value || !import.meta.client) return ''
  return `${window.location.origin}/wizard/${currentProjectId.value}`
})

async function handleNext() {
  const result = validateStep(currentStep.value)

  if (!result.valid) {
    validationErrors.value = result.errors
    toast.add({
      title: 'يرجى تصحيح الأخطاء',
      description: result.errors[0],
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    return
  }

  validationErrors.value = []

  if (currentStep.value === visibleSteps.value.length - 2 && state.value.projectStatus === 'planning') {
    updateField('projectStatus', 'planned')
  }

  nextStep()
}

function handlePrev() {
  validationErrors.value = []
  prevStep()
}

function handleDownload() {
  try {
    downloadMarkdown(state.value)
    toast.add({
      title: 'تم التحميل',
      description: 'تم تحميل ملف المواصفات بنجاح',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch {
    toast.add({
      title: 'خطأ',
      description: 'حدث خطأ أثناء التحميل',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

async function copyProjectUrl() {
  if (!projectUrl.value) return
  try {
    await navigator.clipboard.writeText(projectUrl.value)
    toast.add({
      title: 'تم النسخ',
      description: 'تم نسخ رابط المشروع. يمكنك مشاركته أو فتحه من أي جهاز.',
      color: 'success',
      icon: 'i-lucide-check'
    })
  } catch {
    toast.add({
      title: 'خطأ',
      description: 'فشل في نسخ الرابط',
      color: 'error',
      icon: 'i-lucide-x'
    })
  }
}

async function handleDeleteProject() {
  if (!currentProjectId.value) return

  isDeleting.value = true
  showDeleteModal.value = false

  const isHard = state.value.projectStatus === 'planning'
  let success = false

  if (isHard) {
    success = await deleteProject(currentProjectId.value)
  } else {
    success = await softDeleteProject(currentProjectId.value)
  }

  isDeleting.value = false

  if (success) {
    toast.add({
      title: isHard ? 'تم الحذف' : 'تم الأرشفة',
      description: isHard ? 'تم حذف المشروع نهائياً' : 'تم نقل المشروع للأرشيف',
      color: 'success'
    })
    navigateTo('/projects')
  } else {
    toast.add({
      title: 'خطأ',
      description: 'فشل في حذف المشروع',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
    <!-- Header -->
    <div class="text-center space-y-3">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        معالج مواصفات المشروع
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        املأ البيانات لإنشاء ملف مواصفات جاهز للاستخدام مع Claude
      </p>
      <div v-if="currentProjectId" class="flex items-center justify-center gap-2">
        <UButton
          size="xs"
          variant="ghost"
          icon="i-lucide-link"
          label="نسخ رابط المشروع"
          @click="copyProjectUrl"
        />
        <UButton
          size="xs"
          variant="ghost"
          color="error"
          :icon="isDeleting ? 'i-lucide-loader-2' : 'i-lucide-trash-2'"
          label="حذف المشروع"
          :disabled="isDeleting"
          @click="showDeleteModal = true"
        />
      </div>
    </div>

    <!-- Stepper -->
    <UStepper
      :model-value="String(currentStep)"
      :items="stepperItems"
      orientation="horizontal"
      size="sm"
      class="mb-6"
      disabled
    />

    <!-- Step Content -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon :name="visibleSteps[currentStep].icon" class="w-6 h-6 text-primary-500" />
          <div>
            <h2 class="text-lg font-semibold">{{ visibleSteps[currentStep].titleAr }}</h2>
            <p class="text-sm text-gray-500">الخطوة {{ currentStep + 1 }} من {{ visibleSteps.length }}</p>
          </div>
        </div>
      </template>

      <!-- Validation Errors -->
      <UAlert
        v-if="validationErrors.length > 0"
        color="error"
        icon="i-lucide-alert-circle"
        title="يرجى تصحيح الأخطاء التالية"
        class="mb-4"
      >
        <template #description>
          <ul class="list-disc list-inside">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </template>
      </UAlert>

      <!-- Dynamic Step Content (based on step ID) -->
      <WizardStepsStepQuickReference v-if="visibleSteps[currentStep]?.id === 0" />
      <WizardStepsStepUserStories v-else-if="visibleSteps[currentStep]?.id === 1" />
      <WizardStepsStepPermissions v-else-if="visibleSteps[currentStep]?.id === 2" />
      <WizardStepsStepTechnical v-else-if="visibleSteps[currentStep]?.id === 3" />
      <WizardStepsStepSummary v-else-if="visibleSteps[currentStep]?.id === 4" />
      <WizardStepsStepDatabase v-else-if="visibleSteps[currentStep]?.id === 5" />
      <WizardStepsStepSummaryWithDB v-else-if="visibleSteps[currentStep]?.id === 6" />
      <WizardStepsStepApi v-else-if="visibleSteps[currentStep]?.id === 7" />
      <WizardStepsStepFrontend v-else-if="visibleSteps[currentStep]?.id === 8" />
      <WizardStepsStepFeatures v-else-if="visibleSteps[currentStep]?.id === 9" />
      <WizardStepsStepDependencies v-else-if="visibleSteps[currentStep]?.id === 10" />
      <WizardStepsStepGuidelines v-else-if="visibleSteps[currentStep]?.id === 11" />

      <!-- Navigation Footer -->
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton
            v-if="!isFirstStep"
            variant="ghost"
            icon="i-lucide-arrow-right"
            label="السابق"
            @click="handlePrev"
          />
          <div v-else />

          <div class="flex gap-2">
            <UButton
              v-if="isLastStep"
              color="success"
              icon="i-lucide-download"
              label="تحميل الملف"
              @click="handleDownload"
            />
            <UButton
              v-if="!isLastStep"
              icon="i-lucide-arrow-left"
              trailing
              label="التالي"
              @click="handleNext"
            />
          </div>
        </div>
      </template>
    </UCard>

    <!-- Auto-save Indicator -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isAutoSaving || lastSaved"
        class="fixed bottom-4 left-4 z-50"
      >
        <UBadge
          v-if="isAutoSaving"
          color="warning"
          variant="subtle"
          class="flex items-center gap-1"
        >
          <UIcon name="i-lucide-loader-2" class="w-3 h-3 animate-spin" />
          <span>جارٍ الحفظ في قاعدة البيانات...</span>
        </UBadge>
        <UBadge
          v-else-if="lastSaved"
          color="success"
          variant="subtle"
          class="flex items-center gap-1"
        >
          <UIcon name="i-lucide-cloud-check" class="w-3 h-3" />
          <span>تم الحفظ تلقائياً</span>
        </UBadge>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <UModal
      :open="showDeleteModal"
      title="تأكيد الحذف"
      :close="false"
      @update:open="showDeleteModal = $event"
    >
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تأكيد الحذف</h3>
          </div>

          <p class="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من {{ isHardDelete ? 'حذف' : 'أرشفة' }} المشروع
            <strong class="text-gray-900 dark:text-white">{{ state.projectName || 'بدون اسم' }}</strong>؟
          </p>
          <p class="mt-2 text-sm" :class="isHardDelete ? 'text-red-500' : 'text-yellow-600'">
            {{ isHardDelete
              ? 'سيتم حذف المشروع نهائياً ولا يمكن استرجاعه.'
              : 'سيتم نقل المشروع للأرشيف ويمكن استرجاعه لاحقاً.'
            }}
          </p>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              variant="ghost"
              label="إلغاء"
              @click="showDeleteModal = false"
            />
            <UButton
              :color="isHardDelete ? 'error' : 'warning'"
              :icon="isHardDelete ? 'i-lucide-trash-2' : 'i-lucide-archive'"
              :label="isHardDelete ? 'حذف نهائي' : 'أرشفة المشروع'"
              @click="handleDeleteProject"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
