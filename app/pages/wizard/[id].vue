<script setup>
const route = useRoute()
const router = useRouter()
const { loadProject, isLoading, currentProjectId, state, restoreProject, currentStep, goToStep, visibleSteps } = useWizardState()
const toast = useToast()

const projectId = route.params.id
const loadError = ref(false)
const isRestoring = ref(false)
const isInitialized = ref(false)

const isArchived = computed(() => !!state.value.deletedAt)

const initialStep = computed(() => {
  const step = Number(route.query.step)
  return step >= 0 && step < visibleSteps.value.length ? step : 0
})

watch(currentStep, (newStep) => {
  if (!isInitialized.value) return
  if (Number(route.query.step) !== newStep) {
    router.replace({
      query: { ...route.query, step: newStep > 0 ? newStep : undefined }
    })
  }
})

watch(() => route.query.step, (newStep) => {
  if (!isInitialized.value) return
  const step = Number(newStep) || 0
  if (currentStep.value !== step && step >= 0 && step < visibleSteps.value.length) {
    goToStep(step)
  }
})

useHead({
  title: 'معالج المواصفات'
})

onMounted(async () => {
  if (projectId) {
    const success = await loadProject(projectId)
    if (!success) {
      loadError.value = true
    } else if (initialStep.value > 0) {
      goToStep(initialStep.value)
    }
    isInitialized.value = true
  }
})

async function handleRestore() {
  if (!currentProjectId.value) return

  isRestoring.value = true
  const success = await restoreProject(currentProjectId.value)

  if (success) {
    toast.add({
      title: 'تم الاسترجاع',
      description: 'تم استرجاع المشروع من الأرشيف بنجاح',
      color: 'success'
    })
    await loadProject(currentProjectId.value)
  } else {
    toast.add({
      title: 'خطأ',
      description: 'فشل في استرجاع المشروع',
      color: 'error'
    })
  }

  isRestoring.value = false
}
</script>

<template>
  <UContainer class="py-6">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-primary-500 animate-spin" />
      <p class="text-gray-600 dark:text-gray-400">جارٍ تحميل المشروع...</p>
    </div>

    <div v-else-if="loadError" class="flex flex-col items-center justify-center py-20 space-y-6">
      <UIcon name="i-lucide-file-x" class="w-16 h-16 text-red-500" />
      <div class="text-center space-y-2">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          المشروع غير موجود
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          لم يتم العثور على المشروع المطلوب. ربما تم حذفه أو الرابط غير صحيح.
        </p>
      </div>
      <div class="flex gap-4">
        <UButton to="/" icon="i-lucide-home" variant="outline">
          الصفحة الرئيسية
        </UButton>
        <UButton to="/projects" icon="i-lucide-folder-open">
          مشاريعي
        </UButton>
      </div>
    </div>

    <!-- Archived Project State -->
    <div v-else-if="isArchived" class="flex flex-col items-center justify-center py-20 space-y-6">
      <div class="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
        <UIcon name="i-lucide-archive" class="w-10 h-10 text-yellow-500" />
      </div>
      <div class="text-center space-y-2">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          هذا المشروع مؤرشف
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          لا يمكن التعديل على المشاريع المؤرشفة. يمكنك استرجاع المشروع للتعديل عليه.
        </p>
        <p v-if="state.projectName" class="font-medium text-gray-900 dark:text-white">
          {{ state.projectName }}
        </p>
      </div>
      <div class="flex gap-4">
        <UButton
          to="/projects?filter=archived"
          icon="i-lucide-archive"
          variant="outline"
        >
          الأرشيف
        </UButton>
        <UButton
          :icon="isRestoring ? 'i-lucide-loader-2' : 'i-lucide-archive-restore'"
          color="success"
          :disabled="isRestoring"
          @click="handleRestore"
        >
          استرجاع المشروع
        </UButton>
      </div>
    </div>

    <WizardContainer v-else />
  </UContainer>
</template>
