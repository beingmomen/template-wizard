<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  showRoles: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const { state } = useWizardState()

const selectedPermissions = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
})

const availablePermissions = computed(() =>
  state.value.permissions.map(p => ({
    label: p.name || p.id,
    value: p.id,
    description: p.description
  }))
)

const availableRoles = computed(() =>
  state.value.roles.map(r => ({
    label: r.name || r.id,
    value: r.id,
    description: r.description
  }))
)

const hasPermissions = computed(() =>
  state.value.permissionsConfig?.enabled && state.value.permissions.length > 0
)

const hasRoles = computed(() =>
  state.value.permissionsConfig?.enabled && state.value.roles.length > 0
)
</script>

<template>
  <div v-if="hasPermissions" class="space-y-2">
    <USelectMenu
      v-model="selectedPermissions"
      :items="availablePermissions"
      multiple
      placeholder="اختر الصلاحيات المطلوبة"
      value-key="value"
    >
      <template #label>
        <span v-if="selectedPermissions.length === 0" class="text-gray-500">
          اختر الصلاحيات
        </span>
        <span v-else>
          {{ selectedPermissions.length }} صلاحيات محددة
        </span>
      </template>
    </USelectMenu>

    <div v-if="selectedPermissions.length > 0" class="flex flex-wrap gap-1">
      <UBadge
        v-for="permId in selectedPermissions"
        :key="permId"
        size="sm"
        variant="soft"
      >
        {{ state.permissions.find(p => p.id === permId)?.name || permId }}
      </UBadge>
    </div>
  </div>

  <div v-else class="text-sm text-gray-500 py-2">
    <UIcon name="i-lucide-info" class="inline" />
    لم يتم تفعيل نظام الصلاحيات أو لا توجد صلاحيات معرفة
  </div>
</template>
