<script setup>
import { permissionTypeOptions, permissionActionOptions } from '~/schemas/permissions.schema'

const { state, updateField, updateNestedField } = useWizardState()

const permissionConfigEnabled = computed({
  get: () => state.value.permissionsConfig.enabled,
  set: (val) => updateNestedField('permissionsConfig', 'enabled', val)
})

const permissionSystemType = computed({
  get: () => state.value.permissionsConfig.type,
  set: (val) => updateNestedField('permissionsConfig', 'type', val)
})

function addPermission() {
  const newPermission = {
    id: '',
    name: '',
    resource: '',
    action: 'read',
    description: ''
  }
  updateField('permissions', [...state.value.permissions, newPermission])
}

function removePermission(index) {
  const permissions = [...state.value.permissions]
  permissions.splice(index, 1)
  updateField('permissions', permissions)
}

function updatePermission(index, field, value) {
  const permissions = [...state.value.permissions]
  permissions[index] = { ...permissions[index], [field]: value }

  if (field === 'resource' || field === 'action') {
    permissions[index].id = `${permissions[index].resource}.${permissions[index].action}`
  }

  updateField('permissions', permissions)
}

function addRole() {
  const newRole = {
    id: '',
    name: '',
    description: '',
    permissions: [],
    inheritsFrom: ''
  }
  updateField('roles', [...state.value.roles, newRole])
}

function removeRole(index) {
  const roles = [...state.value.roles]
  roles.splice(index, 1)
  updateField('roles', roles)
}

function updateRole(index, field, value) {
  const roles = [...state.value.roles]
  roles[index] = { ...roles[index], [field]: value }
  updateField('roles', roles)
}

function toggleRolePermission(roleIndex, permissionId) {
  const roles = [...state.value.roles]
  const role = roles[roleIndex]
  const perms = [...(role.permissions || [])]

  const idx = perms.indexOf(permissionId)
  if (idx > -1) {
    perms.splice(idx, 1)
  } else {
    perms.push(permissionId)
  }

  roles[roleIndex] = { ...role, permissions: perms }
  updateField('roles', roles)
}

function generateFromTables() {
  const tables = state.value.tables || []
  const actions = ['create', 'read', 'update', 'delete']
  const newPermissions = []

  tables.forEach(table => {
    if (!table.tableName) return

    actions.forEach(action => {
      const id = `${table.tableName}.${action}`
      const exists = state.value.permissions.some(p => p.id === id)

      if (!exists) {
        newPermissions.push({
          id,
          name: `${getActionArabic(action)} ${table.tableName}`,
          resource: table.tableName,
          action,
          description: table.description || ''
        })
      }
    })
  })

  if (newPermissions.length > 0) {
    updateField('permissions', [...state.value.permissions, ...newPermissions])
  }
}

function getActionArabic(action) {
  const map = {
    create: 'إنشاء',
    read: 'عرض',
    update: 'تعديل',
    delete: 'حذف',
    manage: 'إدارة'
  }
  return map[action] || action
}

const availablePermissions = computed(() =>
  state.value.permissions.map(p => ({
    label: p.name || p.id,
    value: p.id
  }))
)

const availableRoles = computed(() =>
  state.value.roles.map(r => ({
    label: r.name || r.id,
    value: r.id
  }))
)
</script>

<template>
  <div class="space-y-6">
    <UFormField label="نظام الصلاحيات">
      <USwitch
        v-model="permissionConfigEnabled"
        label="تفعيل نظام الصلاحيات"
      />
      <template #hint>
        <span class="text-xs text-gray-500">فعّل هذا الخيار إذا كان المشروع يحتاج لنظام صلاحيات متقدم</span>
      </template>
    </UFormField>

    <template v-if="state.permissionsConfig.enabled">
      <USeparator />

      <UFormField label="نوع نظام الصلاحيات">
        <URadioGroup
          v-model="permissionSystemType"
          :items="permissionTypeOptions"
          class="flex flex-col gap-2"
        />
      </UFormField>

      <USeparator />

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">الصلاحيات</h3>
          <div class="flex gap-2">
            <UButton
              v-if="state.tables?.length > 0"
              size="sm"
              variant="soft"
              color="green"
              icon="i-lucide-wand-2"
              @click="generateFromTables"
            >
              إنشاء من الجداول
            </UButton>
            <UButton
              size="sm"
              variant="soft"
              icon="i-lucide-plus"
              @click="addPermission"
            >
              إضافة صلاحية
            </UButton>
          </div>
        </div>

        <div v-if="state.permissions.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <UIcon name="i-lucide-shield" class="text-4xl text-gray-400 mb-2" />
          <p class="text-gray-500">لا توجد صلاحيات</p>
          <div class="flex justify-center gap-2 mt-2">
            <UButton
              v-if="state.tables?.length > 0"
              size="sm"
              variant="link"
              @click="generateFromTables"
            >
              إنشاء تلقائي من الجداول
            </UButton>
            <UButton
              size="sm"
              variant="link"
              @click="addPermission"
            >
              إضافة صلاحية يدوياً
            </UButton>
          </div>
        </div>

        <div v-for="(permission, index) in state.permissions" :key="index" class="p-4 border rounded-lg space-y-3">
          <div class="flex items-start justify-between">
            <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {{ permission.id || 'resource.action' }}
            </span>
            <UButton
              size="xs"
              variant="ghost"
              color="red"
              icon="i-lucide-trash-2"
              @click="removePermission(index)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <UFormField label="المورد">
              <UInput
                :model-value="permission.resource"
                placeholder="users"
                dir="ltr"
                @update:model-value="updatePermission(index, 'resource', $event)"
              />
            </UFormField>

            <UFormField label="الفعل">
              <USelect
                :model-value="permission.action"
                :items="permissionActionOptions"
                @update:model-value="updatePermission(index, 'action', $event)"
              />
            </UFormField>

            <UFormField label="الاسم">
              <UInput
                :model-value="permission.name"
                placeholder="إنشاء مستخدم"
                @update:model-value="updatePermission(index, 'name', $event)"
              />
            </UFormField>
          </div>
        </div>
      </div>

      <USeparator />

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">الأدوار</h3>
          <UButton
            size="sm"
            variant="soft"
            icon="i-lucide-plus"
            @click="addRole"
          >
            إضافة دور
          </UButton>
        </div>

        <div v-if="state.roles.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <UIcon name="i-lucide-users" class="text-4xl text-gray-400 mb-2" />
          <p class="text-gray-500">لا توجد أدوار</p>
          <UButton
            size="sm"
            variant="link"
            @click="addRole"
          >
            إضافة دور جديد
          </UButton>
        </div>

        <div v-for="(role, roleIndex) in state.roles" :key="roleIndex" class="p-4 border rounded-lg space-y-3">
          <div class="flex items-start justify-between">
            <UBadge color="primary" variant="soft">
              {{ role.name || 'دور جديد' }}
            </UBadge>
            <UButton
              size="xs"
              variant="ghost"
              color="red"
              icon="i-lucide-trash-2"
              @click="removeRole(roleIndex)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormField label="معرف الدور">
              <UInput
                :model-value="role.id"
                placeholder="admin"
                dir="ltr"
                @update:model-value="updateRole(roleIndex, 'id', $event)"
              />
            </UFormField>

            <UFormField label="اسم الدور">
              <UInput
                :model-value="role.name"
                placeholder="المدير"
                @update:model-value="updateRole(roleIndex, 'name', $event)"
              />
            </UFormField>
          </div>

          <UFormField label="الوصف">
            <UInput
              :model-value="role.description"
              placeholder="وصف مختصر للدور"
              @update:model-value="updateRole(roleIndex, 'description', $event)"
            />
          </UFormField>

          <UFormField v-if="availableRoles.length > 1" label="يرث من دور آخر">
            <USelect
              :model-value="role.inheritsFrom"
              :items="availableRoles.filter(r => r.value !== role.id)"
              placeholder="اختر دور للوراثة منه"
              @update:model-value="updateRole(roleIndex, 'inheritsFrom', $event)"
            />
          </UFormField>

          <UFormField v-if="state.permissions.length > 0" label="الصلاحيات">
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="perm in state.permissions"
                :key="perm.id"
                :color="role.permissions?.includes(perm.id) ? 'primary' : 'neutral'"
                :variant="role.permissions?.includes(perm.id) ? 'solid' : 'outline'"
                class="cursor-pointer"
                @click="toggleRolePermission(roleIndex, perm.id)"
              >
                {{ perm.name || perm.id }}
              </UBadge>
            </div>
            <template #hint>
              <span class="text-xs text-gray-500">اضغط على الصلاحية لإضافتها/إزالتها</span>
            </template>
          </UFormField>
        </div>
      </div>

      <USeparator />

      <div class="space-y-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">إعدادات إضافية</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="دور المدير الأعلى">
            <USelect
              :model-value="state.permissionsConfig.superAdminRole"
              :items="availableRoles"
              placeholder="اختر دور المدير الأعلى"
              @update:model-value="updateNestedField('permissionsConfig', 'superAdminRole', $event)"
            />
            <template #hint>
              <span class="text-xs text-gray-500">هذا الدور سيملك جميع الصلاحيات</span>
            </template>
          </UFormField>

          <UFormField label="الدور الافتراضي">
            <USelect
              :model-value="state.permissionsConfig.defaultRole"
              :items="availableRoles"
              placeholder="اختر الدور الافتراضي"
              @update:model-value="updateNestedField('permissionsConfig', 'defaultRole', $event)"
            />
            <template #hint>
              <span class="text-xs text-gray-500">الدور الذي يحصل عليه المستخدمون الجدد</span>
            </template>
          </UFormField>
        </div>
      </div>
    </template>
  </div>
</template>
