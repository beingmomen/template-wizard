<script setup>
import { apiStyleOptions, httpMethodOptions, queryParamTypeOptions, commonQueryParams } from '~/schemas/api.schema'
import { communicationInterfaceOptions } from '~/types/wizard.types'

const { state, updateField } = useWizardState()

function toggleInterface(iface) {
  const current = [...(state.value.communicationInterfaces || [])]
  const idx = current.indexOf(iface)
  if (idx >= 0) {
    if (current.length > 1) current.splice(idx, 1)
  } else {
    current.push(iface)
  }
  updateField('communicationInterfaces', current)
}

const emptyEndpoint = {
  method: 'GET',
  path: '',
  description: '',
  authRequired: false,
  requiredPermissions: []
}

const emptyApiGroup = {
  name: '',
  basePath: '/api',
  description: '',
  endpoints: []
}

const hasPermissions = computed(() =>
  state.value.permissionsConfig?.enabled && state.value.permissions?.length > 0
)

function updateGroup(groupIndex, field, value) {
  const newGroups = [...state.value.apiGroups]
  newGroups[groupIndex][field] = value
  updateField('apiGroups', newGroups)
}

function addEndpointToGroup(groupIndex) {
  const newGroups = [...state.value.apiGroups]
  const basePath = newGroups[groupIndex].basePath || '/api'
  newGroups[groupIndex].endpoints.push({
    ...emptyEndpoint,
    path: basePath
  })
  updateField('apiGroups', newGroups)
}

function removeEndpointFromGroup(groupIndex, endpointIndex) {
  const newGroups = [...state.value.apiGroups]
  newGroups[groupIndex].endpoints.splice(endpointIndex, 1)
  updateField('apiGroups', newGroups)
}

function updateEndpointInGroup(groupIndex, endpointIndex, field, value) {
  const newGroups = [...state.value.apiGroups]
  newGroups[groupIndex].endpoints[endpointIndex][field] = value
  updateField('apiGroups', newGroups)
}

function addCrudEndpoints(groupIndex) {
  const newGroups = [...state.value.apiGroups]
  const basePath = newGroups[groupIndex].basePath || '/api/items'
  const crudEndpoints = [
    { method: 'GET', path: basePath, description: 'جلب القائمة', authRequired: true, requiredPermissions: [] },
    { method: 'GET', path: `${basePath}/:id`, description: 'جلب عنصر واحد', authRequired: true, requiredPermissions: [] },
    { method: 'POST', path: basePath, description: 'إنشاء عنصر جديد', authRequired: true, requiredPermissions: [] },
    { method: 'PATCH', path: `${basePath}/:id`, description: 'تحديث عنصر', authRequired: true, requiredPermissions: [] },
    { method: 'DELETE', path: `${basePath}/:id`, description: 'حذف عنصر', authRequired: true, requiredPermissions: [] }
  ]
  newGroups[groupIndex].endpoints.push(...crudEndpoints)
  updateField('apiGroups', newGroups)
}

function getMethodColor(method) {
  switch (method) {
    case 'GET': return 'success'
    case 'POST': return 'primary'
    case 'PUT': return 'warning'
    case 'PATCH': return 'warning'
    case 'DELETE': return 'error'
    default: return 'neutral'
  }
}

function getGroupName(group) {
  return group.name || 'مجموعة جديدة'
}

const openGroups = ref({})

function toggleGroup(index) {
  openGroups.value[index] = !isGroupOpen(index)
}

function isGroupOpen(index) {
  return openGroups.value[index] === true
}

const groupDeleteConfirm = ref({
  show: false,
  index: -1,
  name: ''
})

function confirmDeleteGroup(index) {
  const groupName = state.value.apiGroups[index]?.name || 'مجموعة جديدة'
  groupDeleteConfirm.value = {
    show: true,
    index,
    name: groupName
  }
}

function executeGroupDelete() {
  const newGroups = state.value.apiGroups.filter((_, i) => i !== groupDeleteConfirm.value.index)
  updateField('apiGroups', newGroups)
  groupDeleteConfirm.value.show = false
}

const emptyQueryParam = {
  name: '',
  type: 'string',
  required: false,
  description: '',
  example: ''
}

function addQueryParam(groupIndex, endpointIndex) {
  const newGroups = [...state.value.apiGroups]
  if (!newGroups[groupIndex].endpoints[endpointIndex].queryParameters) {
    newGroups[groupIndex].endpoints[endpointIndex].queryParameters = []
  }
  newGroups[groupIndex].endpoints[endpointIndex].queryParameters.push({ ...emptyQueryParam })
  updateField('apiGroups', newGroups)
}

function removeQueryParam(groupIndex, endpointIndex, paramIndex) {
  const newGroups = [...state.value.apiGroups]
  newGroups[groupIndex].endpoints[endpointIndex].queryParameters.splice(paramIndex, 1)
  updateField('apiGroups', newGroups)
}

function updateQueryParam(groupIndex, endpointIndex, paramIndex, field, value) {
  const newGroups = [...state.value.apiGroups]
  newGroups[groupIndex].endpoints[endpointIndex].queryParameters[paramIndex][field] = value
  updateField('apiGroups', newGroups)
}

function addCommonParams(groupIndex, endpointIndex, type) {
  const newGroups = [...state.value.apiGroups]
  const endpoint = newGroups[groupIndex].endpoints[endpointIndex]
  if (!endpoint.queryParameters) {
    endpoint.queryParameters = []
  }

  const paramsToAdd = commonQueryParams[type] || []
  paramsToAdd.forEach((param) => {
    if (!endpoint.queryParameters.some(p => p.name === param.name)) {
      endpoint.queryParameters.push({ ...param })
    }
  })

  updateField('apiGroups', newGroups)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Communication Interfaces -->
    <UFormField
      label="واجهات التواصل"
      name="communicationInterfaces"
    >
      <p class="text-xs text-gray-500 mb-2">
        حدد طرق التواصل التي يدعمها مشروعك
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <UCard
          v-for="iface in communicationInterfaceOptions"
          :key="iface.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.communicationInterfaces?.includes(iface.value) ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="toggleInterface(iface.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="iface.icon"
              class="text-2xl"
              :class="state.communicationInterfaces?.includes(iface.value) ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-xs">
                {{ iface.label }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ iface.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>

    <USeparator />

    <!-- HTTP API Section (shown when http-api is selected) -->
    <div
      v-if="state.communicationInterfaces?.includes('http-api')"
      class="space-y-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField
          label="نوع الـ API"
          required
        >
          <URadioGroup
            v-model="state.apiStyle"
            :items="apiStyleOptions"
            class="flex gap-4"
          />
        </UFormField>

        <UFormField label="Route Prefix">
          <UInput
            v-model="state.routePrefix"
            placeholder="/api أو /api/v1"
            dir="ltr"
          />
        </UFormField>
      </div>

      <USeparator />

      <!-- API Groups -->
      <FormDynamicArrayField
        v-model="state.apiGroups"
        label="مجموعات الـ API"
        add-label="إضافة مجموعة API"
        :empty-item="emptyApiGroup"
        :min-items="0"
        :get-item-name="getGroupName"
        item-label="المجموعة"
        hide-delete-button
      >
        <template #default="{ item: group, index: groupIndex }">
          <div class="space-y-4 w-full">
            <!-- Collapsible Header -->
            <div
              class="flex items-center justify-between cursor-pointer p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              @click="toggleGroup(groupIndex)"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-folder-open"
                  class="w-5 h-5 text-primary-500"
                />
                <span class="font-medium text-gray-900 dark:text-white">{{ group.name || 'مجموعة جديدة' }}</span>
                <UBadge
                  size="xs"
                  variant="subtle"
                >
                  {{ group.endpoints?.length || 0 }} endpoints
                </UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UIcon
                  :name="isGroupOpen(groupIndex) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="w-4 h-4 text-gray-500 transition-transform"
                />
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click.stop="confirmDeleteGroup(groupIndex)"
                />
              </div>
            </div>

            <!-- Collapsible Content -->
            <div
              v-show="isGroupOpen(groupIndex)"
              class="space-y-4 pt-2"
            >
              <!-- Group Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField
                  label="اسم المجموعة"
                  required
                >
                  <UInput
                    :model-value="group.name"
                    placeholder="Products API"
                    @update:model-value="updateGroup(groupIndex, 'name', $event)"
                  />
                </UFormField>
                <UFormField label="Base Path">
                  <UInput
                    :model-value="group.basePath"
                    placeholder="/api/products"
                    dir="ltr"
                    @update:model-value="updateGroup(groupIndex, 'basePath', $event)"
                  />
                </UFormField>
              </div>

              <UFormField label="وصف المجموعة">
                <UTextarea
                  :model-value="group.description"
                  placeholder="APIs الخاصة بإدارة المنتجات"
                  :rows="2"
                  :maxrows="10"
                  autoresize
                  @update:model-value="updateGroup(groupIndex, 'description', $event)"
                />
              </UFormField>

              <!-- Endpoints Section -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الـ Endpoints
                  </label>
                  <div class="flex gap-2">
                    <UButton
                      size="xs"
                      variant="soft"
                      icon="i-lucide-layers"
                      label="إضافة CRUD كامل"
                      @click="addCrudEndpoints(groupIndex)"
                    />
                    <UButton
                      size="xs"
                      variant="soft"
                      icon="i-lucide-plus"
                      label="إضافة Endpoint"
                      @click="addEndpointToGroup(groupIndex)"
                    />
                  </div>
                </div>

                <!-- Endpoints List -->
                <div
                  v-if="group.endpoints?.length > 0"
                  class="space-y-2"
                >
                  <div
                    v-for="(endpoint, epIndex) in group.endpoints"
                    :key="epIndex"
                    class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <UFormField label="Method">
                          <USelect
                            :model-value="endpoint.method"
                            :items="httpMethodOptions"
                            size="sm"
                            @update:model-value="updateEndpointInGroup(groupIndex, epIndex, 'method', $event)"
                          />
                        </UFormField>

                        <UFormField
                          label="Path"
                          class="col-span-2"
                        >
                          <UInput
                            :model-value="endpoint.path"
                            placeholder="/products/:id"
                            size="sm"
                            dir="ltr"
                            @update:model-value="updateEndpointInGroup(groupIndex, epIndex, 'path', $event)"
                          >
                            <template #leading>
                              <UBadge
                                :color="getMethodColor(endpoint.method)"
                                variant="subtle"
                                size="xs"
                              >
                                {{ endpoint.method }}
                              </UBadge>
                            </template>
                          </UInput>
                        </UFormField>
                      </div>

                      <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-lucide-trash-2"
                        class="mt-6"
                        @click="removeEndpointFromGroup(groupIndex, epIndex)"
                      />
                    </div>

                    <UFormField
                      label="الوصف"
                      required
                    >
                      <UTextarea
                        :model-value="endpoint.description"
                        placeholder="وصف ما يفعله هذا الـ endpoint"
                        size="sm"
                        :rows="2"
                        :maxrows="10"
                        autoresize
                        @update:model-value="updateEndpointInGroup(groupIndex, epIndex, 'description', $event)"
                      />
                    </UFormField>

                    <div class="flex items-center gap-4">
                      <USwitch
                        :model-value="endpoint.authRequired"
                        label="يتطلب مصادقة"
                        size="sm"
                        @update:model-value="updateEndpointInGroup(groupIndex, epIndex, 'authRequired', $event)"
                      />
                    </div>

                    <!-- Permissions -->
                    <UFormField
                      v-if="endpoint.authRequired && hasPermissions"
                      label="الصلاحيات المطلوبة"
                    >
                      <PermissionsPermissionSelector
                        :model-value="endpoint.requiredPermissions || []"
                        @update:model-value="updateEndpointInGroup(groupIndex, epIndex, 'requiredPermissions', $event)"
                      />
                    </UFormField>

                    <!-- Query Parameters (GET only) -->
                    <div
                      v-if="endpoint.method === 'GET'"
                      class="space-y-3"
                    >
                      <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Query Parameters
                        </label>
                        <div class="flex gap-1 flex-wrap">
                          <UButton
                            size="xs"
                            variant="ghost"
                            @click="addCommonParams(groupIndex, epIndex, 'pagination')"
                          >
                            + Pagination
                          </UButton>
                          <UButton
                            size="xs"
                            variant="ghost"
                            @click="addCommonParams(groupIndex, epIndex, 'search')"
                          >
                            + Search
                          </UButton>
                          <UButton
                            size="xs"
                            variant="ghost"
                            @click="addCommonParams(groupIndex, epIndex, 'sorting')"
                          >
                            + Sort
                          </UButton>
                          <UButton
                            size="xs"
                            variant="soft"
                            icon="i-lucide-plus"
                            @click="addQueryParam(groupIndex, epIndex)"
                          />
                        </div>
                      </div>

                      <!-- Query Params List -->
                      <div
                        v-if="endpoint.queryParameters?.length > 0"
                        class="space-y-2"
                      >
                        <div
                          v-for="(param, paramIndex) in endpoint.queryParameters"
                          :key="paramIndex"
                          class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                        >
                          <UInput
                            :model-value="param.name"
                            placeholder="name"
                            size="xs"
                            class="w-24"
                            dir="ltr"
                            @update:model-value="updateQueryParam(groupIndex, epIndex, paramIndex, 'name', $event)"
                          />
                          <USelect
                            :model-value="param.type"
                            :items="queryParamTypeOptions"
                            size="xs"
                            class="w-28"
                            @update:model-value="updateQueryParam(groupIndex, epIndex, paramIndex, 'type', $event)"
                          />
                          <UInput
                            :model-value="param.description"
                            placeholder="الوصف"
                            size="xs"
                            class="flex-1"
                            @update:model-value="updateQueryParam(groupIndex, epIndex, paramIndex, 'description', $event)"
                          />
                          <USwitch
                            :model-value="param.required"
                            size="xs"
                            @update:model-value="updateQueryParam(groupIndex, epIndex, paramIndex, 'required', $event)"
                          />
                          <span class="text-xs text-gray-500 whitespace-nowrap">مطلوب</span>
                          <UButton
                            size="xs"
                            color="error"
                            variant="ghost"
                            icon="i-lucide-x"
                            @click="removeQueryParam(groupIndex, epIndex, paramIndex)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty state for endpoints -->
                <div
                  v-else
                  class="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
                >
                  <UIcon
                    name="i-lucide-network"
                    class="w-8 h-8 mx-auto text-gray-400"
                  />
                  <p class="mt-2 text-sm text-gray-500">
                    لا توجد endpoints في هذه المجموعة
                  </p>
                  <UButton
                    size="xs"
                    variant="soft"
                    icon="i-lucide-layers"
                    label="إضافة CRUD كامل"
                    class="mt-3"
                    @click="addCrudEndpoints(groupIndex)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </FormDynamicArrayField>

      <!-- Quick Add Auth Endpoints -->
      <UCard variant="subtle">
        <template #header>
          <span class="text-sm font-medium">إضافة سريعة - مجموعات API شائعة</span>
        </template>
        <div class="flex flex-wrap gap-2">
          <UButton
            size="xs"
            variant="soft"
            @click="state.apiGroups.push({
              name: 'Auth API',
              basePath: '/api/auth',
              description: 'APIs المصادقة وإدارة الجلسات',
              endpoints: [
                { method: 'POST', path: '/api/auth/login', description: 'تسجيل الدخول', authRequired: false, requiredPermissions: [] },
                { method: 'POST', path: '/api/auth/register', description: 'إنشاء حساب جديد', authRequired: false, requiredPermissions: [] },
                { method: 'POST', path: '/api/auth/logout', description: 'تسجيل الخروج', authRequired: true, requiredPermissions: [] },
                { method: 'GET', path: '/api/auth/me', description: 'بيانات المستخدم الحالي', authRequired: true, requiredPermissions: [] }
              ]
            })"
          >
            Auth API
          </UButton>
          <UButton
            size="xs"
            variant="soft"
            @click="state.apiGroups.push({
              name: 'Users API',
              basePath: '/api/users',
              description: 'APIs إدارة المستخدمين',
              endpoints: []
            })"
          >
            Users API
          </UButton>
          <UButton
            size="xs"
            variant="soft"
            @click="state.apiGroups.push({
              name: 'Products API',
              basePath: '/api/products',
              description: 'APIs إدارة المنتجات',
              endpoints: []
            })"
          >
            Products API
          </UButton>
        </div>
      </UCard>

      <!-- Legacy endpoints support (if any exist) -->
      <div
        v-if="state.endpoints?.length > 0"
        class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
      >
        <div class="flex items-center gap-2 mb-2">
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-4 h-4 text-yellow-600"
          />
          <span class="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            يوجد {{ state.endpoints.length }} endpoints قديمة بدون تصنيف
          </span>
        </div>
        <p class="text-xs text-yellow-600 dark:text-yellow-400 mb-3">
          يمكنك إنشاء مجموعة جديدة ونقل هذه الـ endpoints إليها
        </p>
        <UButton
          size="xs"
          variant="soft"
          color="warning"
          @click="() => {
            state.apiGroups.push({
              name: 'Uncategorized',
              basePath: '/api',
              description: 'endpoints غير مصنفة',
              endpoints: [...state.endpoints]
            })
            state.endpoints = []
          }"
        >
          نقل للمجموعات
        </UButton>
      </div>
    </div>

    <!-- Group Delete Confirmation Modal -->
    <UModal
      :open="groupDeleteConfirm.show"
      @update:open="groupDeleteConfirm.show = $event"
    >
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-alert-triangle"
                class="w-5 h-5 text-red-500"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              تأكيد حذف المجموعة
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من حذف المجموعة
            <strong class="text-gray-900 dark:text-white">"{{ groupDeleteConfirm.name }}"</strong>؟
          </p>
          <div class="flex justify-end gap-3 mt-6">
            <UButton
              variant="ghost"
              label="إلغاء"
              @click="groupDeleteConfirm.show = false"
            />
            <UButton
              color="error"
              icon="i-lucide-trash-2"
              label="حذف"
              @click="executeGroupDelete"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
