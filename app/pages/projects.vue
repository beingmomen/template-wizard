<script setup>
const { fetchProjects, loadFromCloud, resetState } = useWizardState()
const toast = useToast()

const projects = ref([])
const loading = ref(true)
const loadingProject = ref(null)

onMounted(async () => {
  projects.value = await fetchProjects()
  loading.value = false
})

async function openProject(projectId) {
  loadingProject.value = projectId
  const result = await loadFromCloud(projectId)
  loadingProject.value = null

  if (result.success) {
    navigateTo('/wizard')
  } else {
    toast.add({
      title: 'خطأ',
      description: result.error || 'فشل في تحميل المشروع',
      color: 'error'
    })
  }
}

function startNewProject() {
  resetState()
  navigateTo('/wizard')
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">مشاريعي</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">المشاريع المحفوظة في السحابة</p>
        </div>
        <div class="flex gap-2">
          <UButton
            to="/"
            variant="ghost"
            icon="i-lucide-home"
            label="الرئيسية"
          />
          <UButton
            icon="i-lucide-plus"
            label="مشروع جديد"
            @click="startNewProject"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary-500 mx-auto" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل المشاريع...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="projects.length === 0" class="text-center py-16">
        <UIcon name="i-lucide-folder-open" class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">لا توجد مشاريع محفوظة</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-400">ابدأ بإنشاء مشروع جديد وحفظه في السحابة</p>
        <UButton
          class="mt-6"
          icon="i-lucide-plus"
          label="إنشاء مشروع جديد"
          @click="startNewProject"
        />
      </div>

      <!-- Projects List -->
      <div v-else class="space-y-3">
        <UCard
          v-for="project in projects"
          :key="project.projectId"
          class="cursor-pointer transition-all hover:ring-2 hover:ring-primary-500"
          :class="{ 'opacity-50 pointer-events-none': loadingProject === project.projectId }"
          @click="openProject(project.projectId)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <UIcon name="i-lucide-file-code-2" class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ project.projectName || 'مشروع بدون اسم' }}
                </h3>
                <p v-if="project.projectNameTechnical" class="text-sm text-gray-500">
                  {{ project.projectNameTechnical }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-left">
                <p class="text-xs text-gray-400">آخر تعديل</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(project.updatedAt) }}
                </p>
              </div>
              <UIcon
                v-if="loadingProject === project.projectId"
                name="i-lucide-loader-2"
                class="w-5 h-5 animate-spin text-primary-500"
              />
              <UIcon
                v-else
                name="i-lucide-chevron-left"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Info Alert -->
      <UAlert
        icon="i-lucide-info"
        color="primary"
        variant="subtle"
        title="ملاحظة"
        description="المشاريع مرتبطة بهذا الجهاز. للوصول إليها من جهاز آخر، ستحتاج إلى تصدير المشروع."
      />
    </div>
  </UContainer>
</template>
