<script setup>
import { typeScriptOptions, defaultWarnings } from '~/schemas/guidelines.schema'

const { state, updateField } = useWizardState()

const emptyWarning = {
  warning: ''
}

// Update warning
function updateWarning(index, value) {
  const newWarnings = [...state.value.developmentWarnings]
  newWarnings[index].warning = value
  updateField('developmentWarnings', newWarnings)
}

// Reset to defaults
function resetToDefaults() {
  updateField('developmentWarnings', [...defaultWarnings])
}
</script>

<template>
  <div class="space-y-6">
    <!-- TypeScript Mode -->
    <UFormField label="وضع TypeScript" name="useTypeScript" required>
      <URadioGroup
        v-model="state.useTypeScript"
        :items="typeScriptOptions"
      />
    </UFormField>

    <UAlert
      icon="i-lucide-info"
      color="primary"
      variant="subtle"
      :title="state.useTypeScript === 'config-only' ? 'JavaScript Mode' : 'TypeScript Mode'"
      :description="state.useTypeScript === 'config-only'
        ? 'سيتم استخدام JavaScript في جميع الملفات ما عدا ملفات التكوين (app.config.ts, nuxt.config.ts)'
        : 'سيتم استخدام TypeScript في جميع الملفات'"
    />

    <USeparator />

    <!-- Development Warnings -->
    <div class="flex items-center justify-between">
      <label class="font-medium">المحاذير والتأكيدات</label>
      <UButton
        size="xs"
        variant="ghost"
        icon="i-lucide-rotate-ccw"
        label="إعادة للافتراضي"
        @click="resetToDefaults"
      />
    </div>

    <FormDynamicArrayField
      v-model="state.developmentWarnings"
      label="قائمة المحاذير"
      add-label="إضافة تحذير"
      :empty-item="emptyWarning"
      :min-items="0"
    >
      <template #default="{ item: warning, index }">
        <UFormField label="نص التحذير" required>
          <UTextarea
            :model-value="warning.warning"
            placeholder="اكتب التحذير أو التأكيد هنا..."
            :rows="2"
            @update:model-value="updateWarning(index, $event)"
          />
        </UFormField>
      </template>
    </FormDynamicArrayField>

    <UCard variant="subtle">
      <template #header>
        <span class="text-sm font-medium">أمثلة على المحاذير الإضافية</span>
      </template>
      <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
        <li>استخدم useAsyncData بدلاً من useFetch داخل components</li>
        <li>تأكد من إغلاق الـ database connections</li>
        <li>استخدم environment variables للـ secrets</li>
        <li>اتبع naming conventions الخاصة بالمشروع</li>
        <li>أضف تعليقات للكود المعقد</li>
      </ul>
    </UCard>
  </div>
</template>
