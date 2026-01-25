<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  addLabel: {
    type: String,
    default: 'إضافة'
  },
  minItems: {
    type: Number,
    default: 1
  },
  emptyItem: {
    type: [Object, String, Number],
    required: true
  },
  confirmDelete: {
    type: Boolean,
    default: false
  },
  getItemName: {
    type: Function,
    default: null
  },
  itemLabel: {
    type: String,
    default: 'العنصر'
  },
  hideDeleteButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const deleteConfirm = ref({
  show: false,
  index: -1,
  name: ''
})

// Add new item
function addItem() {
  const newItems = [...props.modelValue, JSON.parse(JSON.stringify(props.emptyItem))]
  emit('update:modelValue', newItems)
}

// Request removal with confirmation
function requestRemove(index) {
  if (props.modelValue.length <= props.minItems) return

  if (props.confirmDelete) {
    const itemName = props.getItemName
      ? props.getItemName(props.modelValue[index])
      : `${props.itemLabel} ${index + 1}`
    deleteConfirm.value = {
      show: true,
      index,
      name: itemName
    }
  } else {
    removeItem(index)
  }
}

// Remove item at index
function removeItem(index) {
  if (props.modelValue.length > props.minItems) {
    const newItems = props.modelValue.filter((_, i) => i !== index)
    emit('update:modelValue', newItems)
  }
}

function executeDelete() {
  removeItem(deleteConfirm.value.index)
  deleteConfirm.value.show = false
}

// Update item at index
function updateItem(index, value) {
  const newItems = [...props.modelValue]
  newItems[index] = value
  emit('update:modelValue', newItems)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header with label and add button -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
      </label>
      <UButton
        size="sm"
        variant="soft"
        icon="i-lucide-plus"
        :label="addLabel"
        @click="addItem"
      />
    </div>

    <!-- Items list -->
    <div class="space-y-3">
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <!-- Item content slot -->
        <div class="flex-1">
          <slot
            :item="item"
            :index="index"
            :update="(val) => updateItem(index, val)"
          />
        </div>

        <!-- Remove button -->
        <UButton
          v-if="modelValue.length > minItems && !hideDeleteButton"
          size="sm"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="requestRemove(index)"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="modelValue.length === 0"
      class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
    >
      <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto text-gray-400" />
      <p class="mt-2 text-gray-500">لا توجد عناصر</p>
      <UButton
        size="sm"
        variant="soft"
        icon="i-lucide-plus"
        :label="addLabel"
        class="mt-3"
        @click="addItem"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal :open="deleteConfirm.show" @update:open="deleteConfirm.show = $event">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تأكيد الحذف</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من حذف
            <strong class="text-gray-900 dark:text-white">"{{ deleteConfirm.name }}"</strong>؟
          </p>
          <div class="flex justify-end gap-3 mt-6">
            <UButton variant="ghost" label="إلغاء" @click="deleteConfirm.show = false" />
            <UButton color="error" icon="i-lucide-trash-2" label="حذف" @click="executeDelete" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
