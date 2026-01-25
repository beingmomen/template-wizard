<script setup>
const { fetchProjects, fetchProjectCounts, createProject, deleteProject, softDeleteProject, restoreProject, updateProjectStatus } = useWizardState()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const projects = ref([])
const loading = ref(true)
const creatingProject = ref(false)
const deletingProjectId = ref(null)
const restoringProjectId = ref(null)
const showDeleteModal = ref(false)
const projectToDelete = ref(null)
const pagination = ref({ page: 1, limit: 5, total: 0, totalPages: 0 })

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return page > 0 ? page : 1
})

const activeFilter = computed(() => {
  const filter = route.query.filter
  return ['planning', 'planned', 'completed', 'archived'].includes(filter) ? filter : null
})

const isArchivedView = computed(() => activeFilter.value === 'archived')

const counts = ref({ all: 0, planning: 0, planned: 0, completed: 0, archived: 0 })

const filters = [
  { value: null, label: 'الكل', icon: 'i-lucide-layers', color: 'text-gray-500', countKey: 'all' },
  { value: 'planning', label: 'جاري التخطيط', icon: 'i-lucide-pencil-ruler', color: 'text-blue-500', countKey: 'planning' },
  { value: 'planned', label: 'تم التخطيط', icon: 'i-lucide-clipboard-check', color: 'text-yellow-500', countKey: 'planned' },
  { value: 'completed', label: 'تم التنفيذ', icon: 'i-lucide-check-circle', color: 'text-green-500', countKey: 'completed' },
  { value: 'archived', label: 'الأرشيف', icon: 'i-lucide-archive', color: 'text-red-500', countKey: 'archived' }
]

const statusConfig = {
  planning: { color: 'info', label: 'جاري التخطيط' },
  planned: { color: 'warning', label: 'تم التخطيط' },
  completed: { color: 'success', label: 'تم التنفيذ' }
}

const showStatusModal = ref(false)
const projectToChangeStatus = ref(null)
const selectedNewStatus = ref(null)

const statusOptions = [
  { value: 'planning', label: 'جاري التخطيط', icon: 'i-lucide-pencil-ruler' },
  { value: 'planned', label: 'تم التخطيط', icon: 'i-lucide-clipboard-check' },
  { value: 'completed', label: 'تم التنفيذ', icon: 'i-lucide-check-circle' }
]

const isHardDelete = computed(() =>
  projectToDelete.value?.projectStatus === 'planning' || isArchivedView.value
)

async function loadProjects() {
  loading.value = true
  const isArchived = activeFilter.value === 'archived'
  const result = await fetchProjects({
    page: currentPage.value,
    limit: 5,
    status: isArchived ? undefined : activeFilter.value,
    archived: isArchived
  })
  projects.value = result.projects
  pagination.value = result.pagination
  loading.value = false
}

async function loadCounts() {
  counts.value = await fetchProjectCounts()
}

function setFilter(filterValue) {
  router.push({
    query: {
      filter: filterValue || undefined,
      page: undefined
    }
  })
}

function onPageChange(page) {
  router.push({
    query: {
      ...route.query,
      page: page > 1 ? page : undefined
    }
  })
}

watch(
  () => route.query,
  () => {
    loadProjects()
    loadCounts()
  },
  { immediate: true }
)

function openProject(projectId) {
  navigateTo(`/wizard/${projectId}`)
}

async function startNewProject() {
  creatingProject.value = true
  try {
    const projectId = await createProject()
    if (projectId) {
      navigateTo(`/wizard/${projectId}`)
    } else {
      toast.add({
        title: 'خطأ',
        description: 'فشل في إنشاء المشروع',
        color: 'error'
      })
    }
  } finally {
    creatingProject.value = false
  }
}

function confirmDelete(project, event) {
  event.stopPropagation()
  projectToDelete.value = project
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!projectToDelete.value) return

  deletingProjectId.value = projectToDelete.value.projectId
  showDeleteModal.value = false

  const isHard = projectToDelete.value.projectStatus === 'planning' || isArchivedView.value
  let success = false

  if (isHard) {
    success = await deleteProject(projectToDelete.value.projectId)
  } else {
    success = await softDeleteProject(projectToDelete.value.projectId)
  }

  if (success) {
    await Promise.all([loadProjects(), loadCounts()])
    toast.add({
      title: isHard ? 'تم الحذف' : 'تم الأرشفة',
      description: isHard ? 'تم حذف المشروع نهائياً' : 'تم نقل المشروع للأرشيف',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'خطأ',
      description: 'فشل في حذف المشروع',
      color: 'error'
    })
  }

  deletingProjectId.value = null
  projectToDelete.value = null
}

async function markAsCompleted(projectId, event) {
  event.stopPropagation()
  const success = await updateProjectStatus(projectId, 'completed')
  if (success) {
    await Promise.all([loadProjects(), loadCounts()])
    toast.add({
      title: 'تم التحديث',
      description: 'تم تحديث حالة المشروع',
      color: 'success'
    })
  }
}

async function handleRestore(project, event) {
  event.stopPropagation()
  restoringProjectId.value = project.projectId

  const success = await restoreProject(project.projectId)

  if (success) {
    await Promise.all([loadProjects(), loadCounts()])
    toast.add({
      title: 'تم الاسترجاع',
      description: 'تم استرجاع المشروع من الأرشيف بنجاح',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'خطأ',
      description: 'فشل في استرجاع المشروع',
      color: 'error'
    })
  }

  restoringProjectId.value = null
}

function cancelDelete() {
  showDeleteModal.value = false
  projectToDelete.value = null
}

function openStatusModal(project, event) {
  event.stopPropagation()
  projectToChangeStatus.value = project
  selectedNewStatus.value = project.projectStatus
  showStatusModal.value = true
}

async function handleStatusChange() {
  if (!projectToChangeStatus.value || !selectedNewStatus.value) return

  const success = await updateProjectStatus(projectToChangeStatus.value.projectId, selectedNewStatus.value)

  if (success) {
    await Promise.all([loadProjects(), loadCounts()])
    toast.add({
      title: 'تم التحديث',
      description: 'تم تحديث حالة المشروع بنجاح',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'خطأ',
      description: 'فشل في تحديث حالة المشروع',
      color: 'error'
    })
  }

  showStatusModal.value = false
  projectToChangeStatus.value = null
  selectedNewStatus.value = null
}

function cancelStatusChange() {
  showStatusModal.value = false
  projectToChangeStatus.value = null
  selectedNewStatus.value = null
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
    <div class="max-w-4xl mx-auto space-y-6">
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
            :icon="creatingProject ? 'i-lucide-loader-2' : 'i-lucide-plus'"
            :label="creatingProject ? 'جارٍ الإنشاء...' : 'مشروع جديد'"
            :disabled="creatingProject"
            @click="startNewProject"
          />
        </div>
      </div>

      <!-- Filter Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <UCard
          v-for="filter in filters"
          :key="filter.value ?? 'all'"
          class="cursor-pointer transition-all"
          :class="activeFilter === filter.value ? 'ring-2 ring-primary-500' : 'hover:ring-1 hover:ring-gray-300'"
          @click="setFilter(filter.value)"
        >
          <div class="flex items-center gap-3">
            <UIcon :name="filter.icon" :class="[filter.color, 'w-6 h-6']" />
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ filter.label }}</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ counts[filter.countKey] }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary-500 mx-auto" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل المشاريع...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="projects.length === 0 && !activeFilter" class="text-center py-16">
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

      <!-- No results for filter -->
      <div v-else-if="projects.length === 0 && activeFilter" class="text-center py-16">
        <UIcon name="i-lucide-search-x" class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" />
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">لا توجد مشاريع</h3>
        <p class="mt-2 text-gray-600 dark:text-gray-400">لا توجد مشاريع بهذه الحالة</p>
        <UButton
          class="mt-6"
          variant="ghost"
          icon="i-lucide-x"
          label="إزالة الفلتر"
          @click="setFilter(null)"
        />
      </div>

      <!-- Projects List -->
      <div v-else class="space-y-3">
        <UCard
          v-for="project in projects"
          :key="project.projectId"
          class="transition-all"
          :class="isArchivedView ? 'opacity-75' : 'cursor-pointer hover:ring-2 hover:ring-primary-500'"
          @click="!isArchivedView && openProject(project.projectId)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :class="isArchivedView ? 'bg-gray-100 dark:bg-gray-800' : 'bg-primary-100 dark:bg-primary-900/30'"
              >
                <UIcon
                  :name="isArchivedView ? 'i-lucide-archive' : 'i-lucide-file-code-2'"
                  :class="isArchivedView ? 'w-6 h-6 text-gray-500' : 'w-6 h-6 text-primary-500'"
                />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ project.projectName || 'مشروع بدون اسم' }}
                  </h3>
                  <UBadge
                    v-if="isArchivedView"
                    color="error"
                    label="مؤرشف"
                    size="sm"
                  />
                  <UBadge
                    v-else
                    :color="statusConfig[project.projectStatus]?.color || 'info'"
                    :label="statusConfig[project.projectStatus]?.label || 'جاري التخطيط'"
                    size="sm"
                  />
                </div>
                <p v-if="project.projectNameTechnical" class="text-sm text-gray-500">
                  {{ project.projectNameTechnical }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-left hidden sm:block">
                <p class="text-xs text-gray-400">آخر تعديل</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(project.updatedAt) }}
                </p>
              </div>

              <!-- Archived Project Actions -->
              <template v-if="isArchivedView">
                <UButton
                  :icon="restoringProjectId === project.projectId ? 'i-lucide-loader-2' : 'i-lucide-archive-restore'"
                  color="success"
                  variant="ghost"
                  size="sm"
                  title="استرجاع المشروع"
                  :disabled="restoringProjectId === project.projectId"
                  @click="handleRestore(project, $event)"
                />
                <UButton
                  :icon="deletingProjectId === project.projectId ? 'i-lucide-loader-2' : 'i-lucide-trash-2'"
                  color="error"
                  variant="ghost"
                  size="sm"
                  title="حذف نهائي"
                  :disabled="deletingProjectId === project.projectId"
                  @click="confirmDelete(project, $event)"
                />
              </template>

              <!-- Normal Project Actions -->
              <template v-else>
                <UButton
                  icon="i-lucide-settings-2"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  title="تغيير حالة المشروع"
                  @click="openStatusModal(project, $event)"
                />
                <UButton
                  :icon="deletingProjectId === project.projectId ? 'i-lucide-loader-2' : 'i-lucide-trash-2'"
                  color="error"
                  variant="ghost"
                  size="sm"
                  :disabled="deletingProjectId === project.projectId"
                  @click="confirmDelete(project, $event)"
                />
                <UIcon
                  name="i-lucide-chevron-left"
                  class="w-5 h-5 text-gray-400"
                />
              </template>
            </div>
          </div>
        </UCard>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center pt-4">
          <UPagination
            :page="currentPage"
            :total="pagination.total"
            :items-per-page="5"
            @update:page="onPageChange"
          />
        </div>
      </div>

      <!-- Info Alert -->
      <UAlert
        icon="i-lucide-info"
        color="primary"
        variant="subtle"
        title="ملاحظة"
        description="يمكنك الوصول لأي مشروع من أي جهاز عن طريق نسخ رابط المشروع ومشاركته."
      />
    </div>

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
            <strong class="text-gray-900 dark:text-white">{{ projectToDelete?.projectName || 'بدون اسم' }}</strong>؟
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
              @click="cancelDelete"
            />
            <UButton
              :color="isHardDelete ? 'error' : 'warning'"
              :icon="isHardDelete ? 'i-lucide-trash-2' : 'i-lucide-archive'"
              :label="isHardDelete ? 'حذف نهائي' : 'أرشفة المشروع'"
              @click="handleDelete"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Status Change Modal -->
    <UModal
      :open="showStatusModal"
      title="تغيير حالة المشروع"
      :close="false"
      @update:open="showStatusModal = $event"
    >
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-settings-2" class="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تغيير حالة المشروع</h3>
              <p class="text-sm text-gray-500">{{ projectToChangeStatus?.projectName || 'بدون اسم' }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">اختر الحالة الجديدة</label>
            <div class="grid grid-cols-1 gap-2">
              <UCard
                v-for="option in statusOptions"
                :key="option.value"
                class="cursor-pointer transition-all"
                :class="selectedNewStatus === option.value ? 'ring-2 ring-primary-500' : 'hover:ring-1 hover:ring-gray-300'"
                @click="selectedNewStatus = option.value"
              >
                <div class="flex items-center gap-3">
                  <UIcon :name="option.icon" class="w-5 h-5" :class="{
                    'text-blue-500': option.value === 'planning',
                    'text-yellow-500': option.value === 'planned',
                    'text-green-500': option.value === 'completed'
                  }" />
                  <span class="font-medium">{{ option.label }}</span>
                  <UIcon
                    v-if="selectedNewStatus === option.value"
                    name="i-lucide-check"
                    class="w-4 h-4 text-primary-500 mr-auto"
                  />
                </div>
              </UCard>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              variant="ghost"
              label="إلغاء"
              @click="cancelStatusChange"
            />
            <UButton
              icon="i-lucide-save"
              label="حفظ التغييرات"
              :disabled="selectedNewStatus === projectToChangeStatus?.projectStatus"
              @click="handleStatusChange"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
