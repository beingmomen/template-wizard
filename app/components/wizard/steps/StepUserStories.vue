<script setup>
const { state, updateField } = useWizardState()

const emptyUserType = {
  userType: '',
  stories: [{ story: '' }]
}

const emptyStory = {
  story: ''
}

// Update user type name
function updateUserTypeName(index, name) {
  const newUserTypes = [...state.value.userTypes]
  newUserTypes[index].userType = name
  updateField('userTypes', newUserTypes)
}

// Update story
function updateStory(userIndex, storyIndex, story) {
  const newUserTypes = [...state.value.userTypes]
  newUserTypes[userIndex].stories[storyIndex].story = story
  updateField('userTypes', newUserTypes)
}

// Add story to user type
function addStory(userIndex) {
  const newUserTypes = [...state.value.userTypes]
  newUserTypes[userIndex].stories.push({ ...emptyStory })
  updateField('userTypes', newUserTypes)
}

// Remove story from user type
function removeStory(userIndex, storyIndex) {
  if (state.value.userTypes[userIndex].stories.length > 1) {
    const newUserTypes = [...state.value.userTypes]
    newUserTypes[userIndex].stories.splice(storyIndex, 1)
    updateField('userTypes', newUserTypes)
  }
}
</script>

<template>
  <div class="space-y-6">
    <UAlert
      icon="i-lucide-info"
      color="primary"
      variant="subtle"
      title="صيغة قصة المستخدم"
      description="كـ [نوع المستخدم] أريد [فعل] لأجل [سبب/هدف]"
    />

    <FormDynamicArrayField
      v-model="state.userTypes"
      label="أنواع المستخدمين"
      add-label="إضافة نوع مستخدم"
      :empty-item="emptyUserType"
    >
      <template #default="{ item, index }">
        <div class="space-y-4">
          <!-- User Type Name -->
          <UFormField :label="`نوع المستخدم ${index + 1}`" required>
            <UInput
              :model-value="item.userType"
              placeholder="مثال: صاحب المحل، المدير، الموظف"
              @update:model-value="updateUserTypeName(index, $event)"
            />
          </UFormField>

          <!-- Stories -->
          <div class="space-y-2 pr-4 border-r-2 border-primary-200 dark:border-primary-800">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">
                قصص المستخدم
              </label>
              <UButton
                size="xs"
                variant="soft"
                icon="i-lucide-plus"
                label="إضافة قصة"
                @click="addStory(index)"
              />
            </div>

            <div
              v-for="(story, storyIndex) in item.stories"
              :key="storyIndex"
              class="flex gap-2"
            >
              <UInput
                :model-value="story.story"
                :placeholder="`كـ ${item.userType || 'مستخدم'} أريد ... لأجل ...`"
                class="flex-1"
                @update:model-value="updateStory(index, storyIndex, $event)"
              />
              <UButton
                v-if="item.stories.length > 1"
                size="sm"
                color="error"
                variant="ghost"
                icon="i-lucide-x"
                @click="removeStory(index, storyIndex)"
              />
            </div>
          </div>
        </div>
      </template>
    </FormDynamicArrayField>

    <!-- Example -->
    <UCard variant="subtle">
      <template #header>
        <span class="text-sm font-medium">مثال على قصص المستخدم</span>
      </template>
      <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
        <li>كـ صاحب محل أريد تسجيل المبيعات لأجل معرفة الربح اليومي</li>
        <li>كـ صاحب محل أريد طباعة فاتورة لأجل إعطائها للعميل</li>
        <li>كـ مدير أريد إدارة المستخدمين لأجل التحكم في الصلاحيات</li>
      </ul>
    </UCard>
  </div>
</template>
