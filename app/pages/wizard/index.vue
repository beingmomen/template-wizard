<script setup>
const { createProject, currentProjectId } = useWizardState()

useHead({
  title: 'معالج المواصفات'
})

onMounted(async () => {
  if (!currentProjectId.value) {
    const projectId = await createProject()
    if (projectId) {
      navigateTo(`/wizard/${projectId}`, { replace: true })
    }
  } else {
    navigateTo(`/wizard/${currentProjectId.value}`, { replace: true })
  }
})
</script>

<template>
  <UContainer class="py-6">
    <div class="flex flex-col items-center justify-center py-20 space-y-4">
      <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-primary-500 animate-spin" />
      <p class="text-gray-600 dark:text-gray-400">جارٍ إنشاء مشروع جديد...</p>
    </div>
  </UContainer>
</template>
