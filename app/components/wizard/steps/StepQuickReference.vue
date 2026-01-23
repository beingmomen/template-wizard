<script setup>
const { state, updateField } = useWizardState()

const sizeOptions = [
  { label: 'صغير (1-5 صفحات)', value: 'small' },
  { label: 'متوسط (5-15 صفحة)', value: 'medium' },
  { label: 'كبير (15+ صفحة)', value: 'large' }
]

const userTypeOptions = [
  { label: 'أفراد', value: 'individuals' },
  { label: 'شركات', value: 'companies' },
  { label: 'كلاهما', value: 'both' }
]

const levelOptions = [
  { label: 'مبتدئ', value: 'beginner' },
  { label: 'متوسط', value: 'intermediate' },
  { label: 'متقدم', value: 'advanced' }
]

const languageOptions = [
  { label: 'عربي', value: 'ar' },
  { label: 'إنجليزي', value: 'en' },
  { label: 'كلاهما', value: 'both' }
]

// Auto-generate technical name from Arabic name
watch(() => state.value.projectName, (name) => {
  if (name && !state.value.projectNameTechnical) {
    // Simple transliteration: just lowercase and replace spaces with dashes
    const technical = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    if (technical) {
      updateField('projectNameTechnical', technical)
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Project Size -->
    <UFormField label="حجم المشروع" name="projectSize" required>
      <URadioGroup
        v-model="state.projectSize"
        :items="sizeOptions"
        class="flex flex-wrap gap-4"
      />
    </UFormField>

    <!-- Project Names -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="اسم المشروع" name="projectName" required>
        <UInput
          v-model="state.projectName"
          placeholder="مثال: نظام إدارة المخزون"
        />
      </UFormField>

      <UFormField label="الاسم التقني (بالإنجليزية)" name="projectNameTechnical" required>
        <UInput
          v-model="state.projectNameTechnical"
          placeholder="مثال: inventory-system"
          dir="ltr"
        />
        <template #hint>
          <span class="text-xs text-gray-500">حروف صغيرة، بدون مسافات، يمكن استخدام (-)</span>
        </template>
      </UFormField>
    </div>

    <!-- Problem Statement -->
    <UFormField label="وصف المشكلة" name="problemStatement" required>
      <UTextarea
        v-model="state.problemStatement"
        placeholder="ما المشكلة التي يحلها المشروع؟ من يعاني منها؟"
        :rows="4"
      />
    </UFormField>

    <!-- Solution Description -->
    <UFormField label="وصف الحل" name="solutionDescription" required>
      <UTextarea
        v-model="state.solutionDescription"
        placeholder="كيف يحل المشروع هذه المشكلة؟ ما الذي يميز حلك؟"
        :rows="4"
      />
    </UFormField>

    <!-- Target Users -->
    <UFormField label="المستخدمين المستهدفين" name="targetUsers" required>
      <UTextarea
        v-model="state.targetUsers"
        placeholder="من سيستخدم المشروع؟ صف الفئة المستهدفة بالتفصيل"
        :rows="3"
      />
    </UFormField>

    <!-- User Type, Level, Language -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UFormField label="نوع المستخدم" name="targetUserType">
        <USelect
          v-model="state.targetUserType"
          :items="userTypeOptions"
        />
      </UFormField>

      <UFormField label="المستوى التقني" name="targetUserLevel">
        <USelect
          v-model="state.targetUserLevel"
          :items="levelOptions"
        />
      </UFormField>

      <UFormField label="اللغة الأساسية" name="primaryLanguage">
        <USelect
          v-model="state.primaryLanguage"
          :items="languageOptions"
        />
      </UFormField>
    </div>
  </div>
</template>
