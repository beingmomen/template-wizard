<script setup>
const { state, currentStep, visibleSteps, isFirstStep, isLastStep, nextStep, prevStep, saveToCloud, isSaving, isAutoSaving, lastSaved } = useWizardState()
const { validateStep } = useStepValidation()
const { downloadMarkdown } = useMarkdownGenerator()
const toast = useToast()

// Create stepper items from wizard steps
const stepperItems = computed(() =>
  visibleSteps.value.map(step => ({
    title: step.titleAr,
    icon: step.icon,
    value: String(step.id)
  }))
)

// Validation errors for current step
const validationErrors = ref([])

// Handle next step with validation
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
  nextStep()
}

// Handle previous step
function handlePrev() {
  validationErrors.value = []
  prevStep()
}

// Handle download
function handleDownload() {
  try {
    downloadMarkdown(state.value)
    toast.add({
      title: 'تم التحميل',
      description: 'تم تحميل ملف المواصفات بنجاح',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (e) {
    toast.add({
      title: 'خطأ',
      description: 'حدث خطأ أثناء التحميل',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

// Handle save to cloud
async function handleSaveToCloud() {
  const result = await saveToCloud()

  if (result.success) {
    toast.add({
      title: 'تم الحفظ',
      description: 'تم حفظ المشروع في السحابة بنجاح',
      color: 'success',
      icon: 'i-lucide-cloud-check'
    })
  } else {
    toast.add({
      title: 'خطأ',
      description: result.error || 'فشل في حفظ المشروع',
      color: 'error',
      icon: 'i-lucide-cloud-off'
    })
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        معالج مواصفات المشروع
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        املأ البيانات لإنشاء ملف مواصفات جاهز للاستخدام مع Claude
      </p>
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

      <!-- Dynamic Step Content -->
      <WizardStepsStepQuickReference v-if="currentStep === 0" />
      <WizardStepsStepUserStories v-else-if="currentStep === 1" />
      <WizardStepsStepTechnical v-else-if="currentStep === 2" />
      <WizardStepsStepDatabase v-else-if="currentStep === 3" />
      <WizardStepsStepApi v-else-if="currentStep === 4" />
      <WizardStepsStepFrontend v-else-if="currentStep === 5" />
      <WizardStepsStepFeatures v-else-if="currentStep === 6" />
      <WizardStepsStepDependencies v-else-if="currentStep === 7" />
      <WizardStepsStepGuidelines v-else-if="currentStep === 8" />

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
              variant="outline"
              icon="i-lucide-cloud-upload"
              label="حفظ في السحابة"
              :loading="isSaving"
              @click="handleSaveToCloud"
            />
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
          <span>جاري الحفظ...</span>
        </UBadge>
        <UBadge
          v-else-if="lastSaved"
          color="success"
          variant="subtle"
          class="flex items-center gap-1"
        >
          <UIcon name="i-lucide-check" class="w-3 h-3" />
          <span>تم الحفظ</span>
        </UBadge>
      </div>
    </Transition>
  </div>
</template>
