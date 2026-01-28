<script setup>
import { COMMON_SHARED_COMPONENTS, COMPONENT_CATEGORY_LABELS } from '~/types/wizard.types'

const { state, updateField } = useWizardState()

const openModules = ref({})

function toggleModule(index) {
  openModules.value[index] = !isModuleOpen(index)
}

function isModuleOpen(index) {
  return openModules.value[index] === true
}

const moduleDeleteConfirm = ref({
  show: false,
  index: -1,
  name: ''
})

function confirmDeleteModule(index) {
  moduleDeleteConfirm.value = {
    show: true,
    index,
    name: state.value.frontendModules[index]?.name || 'Module بدون اسم'
  }
}

function executeDeleteModule() {
  const newModules = [...state.value.frontendModules]
  newModules.splice(moduleDeleteConfirm.value.index, 1)
  updateField('frontendModules', newModules)
  moduleDeleteConfirm.value.show = false
}

const emptyPage = {
  path: '/',
  name: '',
  description: '',
  auth: false,
  requiredPermissions: [],
  requiredRoles: []
}

const emptyModule = {
  name: '',
  basePath: '/',
  description: '',
  pages: []
}

const hasPermissions = computed(() =>
  state.value.permissionsConfig?.enabled && state.value.permissions?.length > 0
)

const hasRoles = computed(() =>
  state.value.permissionsConfig?.enabled && state.value.roles?.length > 0
)

const availableRoles = computed(() =>
  (state.value.roles || []).map(r => ({
    label: r.name || r.id,
    value: r.id
  }))
)

function updateModule(moduleIndex, field, value) {
  const newModules = [...state.value.frontendModules]
  newModules[moduleIndex][field] = value
  updateField('frontendModules', newModules)
}

function addPageToModule(moduleIndex) {
  const newModules = [...state.value.frontendModules]
  const basePath = newModules[moduleIndex].basePath || '/'
  newModules[moduleIndex].pages.push({
    ...emptyPage,
    path: basePath
  })
  updateField('frontendModules', newModules)
}

function removePageFromModule(moduleIndex, pageIndex) {
  const newModules = [...state.value.frontendModules]
  newModules[moduleIndex].pages.splice(pageIndex, 1)
  updateField('frontendModules', newModules)
}

function updatePageInModule(moduleIndex, pageIndex, field, value) {
  const newModules = [...state.value.frontendModules]
  newModules[moduleIndex].pages[pageIndex][field] = value
  updateField('frontendModules', newModules)
}

function addCommonPagesToModule(moduleIndex, type) {
  const newModules = [...state.value.frontendModules]
  const basePath = newModules[moduleIndex].basePath || '/items'
  const moduleName = newModules[moduleIndex].name || 'العناصر'

  const pageTemplates = {
    list: { path: basePath, name: `قائمة ${moduleName}`, description: `عرض قائمة ${moduleName} مع البحث والفلترة`, auth: true },
    detail: { path: `${basePath}/:id`, name: `تفاصيل ${moduleName}`, description: `عرض تفاصيل عنصر واحد`, auth: true },
    create: { path: `${basePath}/create`, name: `إضافة ${moduleName}`, description: `نموذج إضافة عنصر جديد`, auth: true },
    edit: { path: `${basePath}/:id/edit`, name: `تعديل ${moduleName}`, description: `نموذج تعديل عنصر`, auth: true }
  }

  if (pageTemplates[type]) {
    newModules[moduleIndex].pages.push({
      ...pageTemplates[type],
      requiredPermissions: [],
      requiredRoles: []
    })
    updateField('frontendModules', newModules)
  }
}

function addAllCrudPages(moduleIndex) {
  const newModules = [...state.value.frontendModules]
  const basePath = newModules[moduleIndex].basePath || '/items'
  const moduleName = newModules[moduleIndex].name || 'العناصر'

  const crudPages = [
    { path: basePath, name: `قائمة ${moduleName}`, description: `عرض قائمة ${moduleName} مع البحث والفلترة`, auth: true, requiredPermissions: [], requiredRoles: [] },
    { path: `${basePath}/:id`, name: `تفاصيل ${moduleName}`, description: `عرض تفاصيل عنصر واحد`, auth: true, requiredPermissions: [], requiredRoles: [] },
    { path: `${basePath}/create`, name: `إضافة ${moduleName}`, description: `نموذج إضافة عنصر جديد`, auth: true, requiredPermissions: [], requiredRoles: [] },
    { path: `${basePath}/:id/edit`, name: `تعديل ${moduleName}`, description: `نموذج تعديل عنصر`, auth: true, requiredPermissions: [], requiredRoles: [] }
  ]

  newModules[moduleIndex].pages.push(...crudPages)
  updateField('frontendModules', newModules)
}

function getModuleName(module) {
  return module.name || 'Module جديد'
}

const showComponentPicker = ref(false)
const customComponent = ref({ name: '', description: '' })

const componentCategories = computed(() => {
  return Object.keys(COMPONENT_CATEGORY_LABELS)
})

function getComponentsByCategory(category) {
  return COMMON_SHARED_COMPONENTS.filter(c => c.category === category)
}

function getCategoryLabel(category) {
  return COMPONENT_CATEGORY_LABELS[category] || category
}

function isComponentSelected(name) {
  return (state.value.sharedComponents || []).some(c => c.name === name)
}

function addComponent(component) {
  const current = state.value.sharedComponents || []
  if (!isComponentSelected(component.name)) {
    updateField('sharedComponents', [...current, { ...component }])
  }
}

function removeComponent(index) {
  const current = [...(state.value.sharedComponents || [])]
  current.splice(index, 1)
  updateField('sharedComponents', current)
}

function addCustomComponent() {
  if (!customComponent.value.name.trim()) return
  const current = state.value.sharedComponents || []
  if (!isComponentSelected(customComponent.value.name)) {
    updateField('sharedComponents', [...current, {
      name: customComponent.value.name.trim(),
      description: customComponent.value.description.trim() || 'مكون مخصص',
      category: 'utility'
    }])
  }
  customComponent.value = { name: '', description: '' }
}

function addAllFromCategory(category) {
  const current = state.value.sharedComponents || []
  const toAdd = getComponentsByCategory(category).filter(c => !isComponentSelected(c.name))
  updateField('sharedComponents', [...current, ...toAdd])
}
</script>

<template>
  <div class="space-y-6">
    <!-- Frontend Modules -->
    <FormDynamicArrayField
      v-model="state.frontendModules"
      label="الـ Modules"
      add-label="إضافة Module"
      :empty-item="emptyModule"
      :min-items="0"
      hide-delete-button
    >
      <template #default="{ item: module, index: moduleIndex }">
        <div class="space-y-4 w-full">
          <!-- Collapsible Header -->
          <div
            class="flex items-center justify-between cursor-pointer p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="toggleModule(moduleIndex)"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-layout-grid" class="w-5 h-5 text-primary-500" />
              <span class="font-medium text-gray-900 dark:text-white">{{ module.name || 'Module جديد' }}</span>
              <UBadge size="xs" variant="subtle">{{ module.pages?.length || 0 }} صفحات</UBadge>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                :name="isModuleOpen(moduleIndex) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="w-4 h-4 text-gray-500 transition-transform"
              />
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click.stop="confirmDeleteModule(moduleIndex)"
              />
            </div>
          </div>

          <!-- Collapsible Content -->
          <div v-show="isModuleOpen(moduleIndex)" class="space-y-4">

          <!-- Module Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="اسم الـ Module" required>
              <UInput
                :model-value="module.name"
                placeholder="المنتجات"
                @update:model-value="updateModule(moduleIndex, 'name', $event)"
              />
            </UFormField>
            <UFormField label="Base Path">
              <UInput
                :model-value="module.basePath"
                placeholder="/products"
                dir="ltr"
                @update:model-value="updateModule(moduleIndex, 'basePath', $event)"
              />
            </UFormField>
          </div>

          <UFormField label="وصف الـ Module">
            <UInput
              :model-value="module.description"
              placeholder="صفحات إدارة المنتجات"
              @update:model-value="updateModule(moduleIndex, 'description', $event)"
            />
          </UFormField>

          <!-- Pages Section -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">
                الصفحات
              </label>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="soft"
                  icon="i-lucide-layers"
                  label="إضافة CRUD كامل"
                  @click="addAllCrudPages(moduleIndex)"
                />
                <UButton
                  size="xs"
                  variant="soft"
                  icon="i-lucide-plus"
                  label="إضافة صفحة"
                  @click="addPageToModule(moduleIndex)"
                />
              </div>
            </div>

            <!-- Pages List -->
            <div v-if="module.pages?.length > 0" class="space-y-2">
              <div
                v-for="(page, pageIndex) in module.pages"
                :key="pageIndex"
                class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UFormField label="المسار (Path)" required>
                      <UInput
                        :model-value="page.path"
                        placeholder="/products"
                        size="sm"
                        dir="ltr"
                        @update:model-value="updatePageInModule(moduleIndex, pageIndex, 'path', $event)"
                      />
                    </UFormField>

                    <UFormField label="اسم الصفحة" required>
                      <UInput
                        :model-value="page.name"
                        placeholder="صفحة المنتجات"
                        size="sm"
                        @update:model-value="updatePageInModule(moduleIndex, pageIndex, 'name', $event)"
                      />
                    </UFormField>
                  </div>

                  <UButton
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    class="mt-6"
                    @click="removePageFromModule(moduleIndex, pageIndex)"
                  />
                </div>

                <UFormField label="وصف الصفحة" required>
                  <UInput
                    :model-value="page.description"
                    placeholder="عرض قائمة المنتجات مع البحث والفلترة"
                    size="sm"
                    @update:model-value="updatePageInModule(moduleIndex, pageIndex, 'description', $event)"
                  />
                </UFormField>

                <USwitch
                  :model-value="page.auth"
                  label="تتطلب تسجيل دخول"
                  size="sm"
                  @update:model-value="updatePageInModule(moduleIndex, pageIndex, 'auth', $event)"
                />

                <!-- Permissions & Roles -->
                <template v-if="page.auth && (hasPermissions || hasRoles)">
                  <UFormField v-if="hasPermissions" label="الصلاحيات المطلوبة">
                    <PermissionsPermissionSelector
                      :model-value="page.requiredPermissions || []"
                      @update:model-value="updatePageInModule(moduleIndex, pageIndex, 'requiredPermissions', $event)"
                    />
                  </UFormField>

                  <UFormField v-if="hasRoles" label="الأدوار المسموحة">
                    <USelectMenu
                      :model-value="page.requiredRoles || []"
                      :items="availableRoles"
                      multiple
                      placeholder="اختر الأدوار المسموحة"
                      value-key="value"
                      size="sm"
                      @update:model-value="updatePageInModule(moduleIndex, pageIndex, 'requiredRoles', $event)"
                    />
                  </UFormField>
                </template>
              </div>
            </div>

            <!-- Empty state for pages -->
            <div
              v-else
              class="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
            >
              <UIcon name="i-lucide-layout" class="w-8 h-8 mx-auto text-gray-400" />
              <p class="mt-2 text-sm text-gray-500">لا توجد صفحات في هذا الـ Module</p>
              <div class="flex justify-center gap-2 mt-3">
                <UButton
                  size="xs"
                  variant="soft"
                  icon="i-lucide-layers"
                  label="إضافة CRUD كامل"
                  @click="addAllCrudPages(moduleIndex)"
                />
              </div>
            </div>

            <!-- Quick add pages -->
            <div class="flex flex-wrap gap-2 pt-2">
              <UButton size="xs" variant="ghost" @click="addCommonPagesToModule(moduleIndex, 'list')">+ قائمة</UButton>
              <UButton size="xs" variant="ghost" @click="addCommonPagesToModule(moduleIndex, 'detail')">+ تفاصيل</UButton>
              <UButton size="xs" variant="ghost" @click="addCommonPagesToModule(moduleIndex, 'create')">+ إنشاء</UButton>
              <UButton size="xs" variant="ghost" @click="addCommonPagesToModule(moduleIndex, 'edit')">+ تعديل</UButton>
            </div>
          </div>
          </div>
        </div>
      </template>
    </FormDynamicArrayField>

    <!-- Quick Add Common Modules -->
    <UCard variant="subtle">
      <template #header>
        <span class="text-sm font-medium">إضافة سريعة - Modules شائعة</span>
      </template>
      <div class="flex flex-wrap gap-2">
        <UButton
          size="xs"
          variant="soft"
          @click="state.frontendModules.push({
            name: 'المصادقة',
            basePath: '/auth',
            description: 'صفحات تسجيل الدخول والتسجيل',
            pages: [
              { path: '/login', name: 'تسجيل الدخول', description: 'صفحة تسجيل الدخول', auth: false, requiredPermissions: [], requiredRoles: [] },
              { path: '/register', name: 'إنشاء حساب', description: 'صفحة إنشاء حساب جديد', auth: false, requiredPermissions: [], requiredRoles: [] },
              { path: '/forgot-password', name: 'نسيت كلمة المرور', description: 'صفحة استعادة كلمة المرور', auth: false, requiredPermissions: [], requiredRoles: [] }
            ]
          })"
        >
          Auth Module
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.frontendModules.push({
            name: 'لوحة التحكم',
            basePath: '/dashboard',
            description: 'صفحات لوحة التحكم الرئيسية',
            pages: [
              { path: '/dashboard', name: 'الرئيسية', description: 'لوحة التحكم الرئيسية', auth: true, requiredPermissions: [], requiredRoles: [] }
            ]
          })"
        >
          Dashboard Module
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.frontendModules.push({
            name: 'المستخدمين',
            basePath: '/users',
            description: 'إدارة المستخدمين',
            pages: []
          })"
        >
          Users Module
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.frontendModules.push({
            name: 'الإعدادات',
            basePath: '/settings',
            description: 'إعدادات التطبيق والحساب',
            pages: [
              { path: '/settings', name: 'الإعدادات العامة', description: 'الإعدادات العامة للتطبيق', auth: true, requiredPermissions: [], requiredRoles: [] },
              { path: '/settings/profile', name: 'الملف الشخصي', description: 'إعدادات الملف الشخصي', auth: true, requiredPermissions: [], requiredRoles: [] }
            ]
          })"
        >
          Settings Module
        </UButton>
      </div>
    </UCard>

    <!-- Legacy pages support (if any exist) -->
    <div v-if="state.pages?.length > 0" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div class="flex items-center gap-2 mb-2">
        <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-yellow-600" />
        <span class="text-sm font-medium text-yellow-700 dark:text-yellow-300">
          يوجد {{ state.pages.length }} صفحات قديمة بدون تصنيف
        </span>
      </div>
      <p class="text-xs text-yellow-600 dark:text-yellow-400 mb-3">
        يمكنك إنشاء Module جديد ونقل هذه الصفحات إليه
      </p>
      <UButton
        size="xs"
        variant="soft"
        color="warning"
        @click="() => {
          state.frontendModules.push({
            name: 'غير مصنف',
            basePath: '/',
            description: 'صفحات غير مصنفة',
            pages: [...state.pages]
          })
          state.pages = []
        }"
      >
        نقل للـ Modules
      </UButton>
    </div>

    <USeparator />

    <!-- Shared Components -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">المكونات المشتركة</h3>
        <UButton
          size="sm"
          variant="soft"
          icon="i-lucide-plus"
          @click="showComponentPicker = true"
        >
          إضافة من القائمة
        </UButton>
      </div>

      <!-- Selected Components -->
      <div v-if="state.sharedComponents?.length > 0" class="flex flex-wrap gap-2">
        <UBadge
          v-for="(comp, idx) in state.sharedComponents"
          :key="idx"
          size="lg"
          variant="subtle"
          class="flex items-center gap-2 pr-1"
        >
          <span>{{ comp.name }}</span>
          <UButton
            size="2xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            class="rounded-full"
            @click="removeComponent(idx)"
          />
        </UBadge>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
      >
        <UIcon name="i-lucide-component" class="w-8 h-8 mx-auto text-gray-400" />
        <p class="mt-2 text-sm text-gray-500">لم يتم اختيار أي مكونات مشتركة</p>
        <UButton
          size="xs"
          variant="soft"
          class="mt-3"
          @click="showComponentPicker = true"
        >
          اختيار المكونات
        </UButton>
      </div>

      <!-- Add Custom Component -->
      <UCard variant="subtle">
        <template #header>
          <span class="text-sm font-medium">إضافة مكون مخصص</span>
        </template>
        <div class="flex gap-2">
          <UInput
            v-model="customComponent.name"
            placeholder="اسم المكون"
            size="sm"
            class="flex-1"
            dir="ltr"
          />
          <UInput
            v-model="customComponent.description"
            placeholder="الوصف"
            size="sm"
            class="flex-[2]"
          />
          <UButton
            size="sm"
            icon="i-lucide-plus"
            :disabled="!customComponent.name.trim()"
            @click="addCustomComponent"
          >
            إضافة
          </UButton>
        </div>
      </UCard>

      <!-- Quick Add by Category -->
      <UCard variant="subtle">
        <template #header>
          <span class="text-sm font-medium">إضافة سريعة حسب التصنيف</span>
        </template>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="category in componentCategories"
            :key="category"
            size="xs"
            variant="soft"
            @click="addAllFromCategory(category)"
          >
            + {{ getCategoryLabel(category) }}
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Component Picker Modal -->
    <UModal :open="showComponentPicker" @update:open="showComponentPicker = $event">
      <template #content>
        <div class="p-6 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">اختيار المكونات المشتركة</h3>
            <UButton
              variant="ghost"
              icon="i-lucide-x"
              @click="showComponentPicker = false"
            />
          </div>

          <div class="space-y-6">
            <div v-for="category in componentCategories" :key="category">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-700 dark:text-gray-300">
                  {{ getCategoryLabel(category) }}
                </h4>
                <UButton
                  size="2xs"
                  variant="ghost"
                  @click="addAllFromCategory(category)"
                >
                  إضافة الكل
                </UButton>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <UButton
                  v-for="comp in getComponentsByCategory(category)"
                  :key="comp.name"
                  size="sm"
                  :variant="isComponentSelected(comp.name) ? 'solid' : 'outline'"
                  :color="isComponentSelected(comp.name) ? 'primary' : 'neutral'"
                  class="justify-start text-right"
                  :disabled="isComponentSelected(comp.name)"
                  @click="addComponent(comp)"
                >
                  <div class="flex flex-col items-start">
                    <span class="font-medium" dir="ltr">{{ comp.name }}</span>
                    <span class="text-xs opacity-70">{{ comp.description }}</span>
                  </div>
                </UButton>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <UButton
              variant="ghost"
              label="إغلاق"
              @click="showComponentPicker = false"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Module Confirmation Modal -->
    <UModal :open="moduleDeleteConfirm.show" @update:open="moduleDeleteConfirm.show = $event">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold">تأكيد الحذف</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من حذف الـ Module
            <strong>"{{ moduleDeleteConfirm.name }}"</strong>؟
            <br>
            <span class="text-sm text-red-500">سيتم حذف جميع الصفحات الموجودة فيه.</span>
          </p>
          <div class="flex justify-end gap-3 mt-6">
            <UButton variant="ghost" label="إلغاء" @click="moduleDeleteConfirm.show = false" />
            <UButton color="error" icon="i-lucide-trash-2" label="حذف" @click="executeDeleteModule" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
