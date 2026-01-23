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
  }
})

const emit = defineEmits(['update:modelValue'])

// Add new item
function addItem() {
  const newItems = [...props.modelValue, JSON.parse(JSON.stringify(props.emptyItem))]
  emit('update:modelValue', newItems)
}

// Remove item at index
function removeItem(index) {
  if (props.modelValue.length > props.minItems) {
    const newItems = props.modelValue.filter((_, i) => i !== index)
    emit('update:modelValue', newItems)
  }
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
          v-if="modelValue.length > minItems"
          size="sm"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="removeItem(index)"
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
  </div>
</template>
