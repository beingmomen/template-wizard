<script setup>
import { typeScriptOptions, defaultWarnings } from '~/schemas/guidelines.schema'

const { state, updateField } = useWizardState()
const { generatePrompt } = usePromptGenerator()
const toast = useToast()

const generatedPrompt = computed(() => generatePrompt(state.value))

const defaultWarningsList = computed(() =>
  state.value.developmentWarnings.filter(w => w.isDefault)
)

const customWarnings = computed(() =>
  state.value.developmentWarnings.filter(w => !w.isDefault)
)

function toggleDefaultWarning(defaultIndex, enabled) {
  const newWarnings = [...state.value.developmentWarnings]
  let count = 0
  for (let i = 0; i < newWarnings.length; i++) {
    if (newWarnings[i].isDefault) {
      if (count === defaultIndex) {
        newWarnings[i] = { ...newWarnings[i], enabled }
        break
      }
      count++
    }
  }
  updateField('developmentWarnings', newWarnings)
}

const emptyCustomWarning = {
  warning: '',
  enabled: true,
  isDefault: false
}

function updateCustomWarnings(newCustom) {
  const defaults = state.value.developmentWarnings.filter(w => w.isDefault)
  updateField('developmentWarnings', [...defaults, ...newCustom])
}

function updateCustomWarning(customIndex, value) {
  const newWarnings = [...state.value.developmentWarnings]
  const nonDefaultIndices = []
  for (let i = 0; i < newWarnings.length; i++) {
    if (!newWarnings[i].isDefault) nonDefaultIndices.push(i)
  }
  if (nonDefaultIndices[customIndex] !== undefined) {
    newWarnings[nonDefaultIndices[customIndex]] = {
      ...newWarnings[nonDefaultIndices[customIndex]],
      warning: value
    }
  }
  updateField('developmentWarnings', newWarnings)
}

function resetToDefaults() {
  const customOnes = state.value.developmentWarnings.filter(w => !w.isDefault)
  updateField('developmentWarnings', [...defaultWarnings.map(w => ({ ...w })), ...customOnes])
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value)
    toast.add({
      title: 'تم النسخ',
      description: 'تم نسخ النص بنجاح',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'خطأ',
      description: 'فشل في نسخ النص',
      icon: 'i-lucide-x',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <UFormField
      label="وضع TypeScript"
      name="useTypeScript"
      required
    >
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

    <div class="space-y-2">
      <div
        v-for="(warning, index) in defaultWarningsList"
        :key="'default-' + index"
        class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <UCheckbox
          :model-value="warning.enabled"
          :label="warning.warning"
          @update:model-value="toggleDefaultWarning(index, $event)"
        />
      </div>
    </div>

    <FormDynamicArrayField
      :model-value="customWarnings"
      label="محاذير مخصصة"
      add-label="إضافة تحذير مخصص"
      :empty-item="emptyCustomWarning"
      :min-items="0"
      @update:model-value="updateCustomWarnings($event)"
    >
      <template #default="{ item: warning, index }">
        <UFormField
          label="نص التحذير"
          required
        >
          <UTextarea
            :model-value="warning.warning"
            placeholder="اكتب التحذير المخصص هنا..."
            :rows="3"
            autoresize
            @update:model-value="updateCustomWarning(index, $event)"
          />
        </UFormField>
      </template>
    </FormDynamicArrayField>

    <USeparator />

    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-file-json"
          class="text-xl text-primary-500"
        />
        <h3 class="font-semibold text-gray-900 dark:text-white">
          إعدادات التصدير
        </h3>
      </div>

      <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <UCheckbox
          :model-value="state.includeMcpJson"
          label="تضمين ملف .mcp.json في المجلد المُصدَّر"
          @update:model-value="updateField('includeMcpJson', $event)"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 mr-7">
          إذا كان لديك MCP servers مثبتة مسبقاً في بيئة Claude Code، يمكنك تعطيل هذا الخيار
        </p>
      </div>
    </div>

    <USeparator />

    <div class="space-y-4">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-terminal"
          class="text-xl text-primary-500"
        />
        <h3 class="font-semibold text-gray-900 dark:text-white">
          نص الأمر الجاهز
        </h3>
      </div>

      <UAlert
        color="primary"
        variant="subtle"
        icon="i-lucide-info"
        title="كيفية الاستخدام"
        description="بعد تحميل مجلد المشروع، انسخ هذا النص وأعطه لـ Claude أو أي AI assistant مع الملفات المُحمَّلة"
      />

      <UCard>
        <UTextarea
          :model-value="generatedPrompt"
          readonly
          :rows="12"
          class="font-mono text-sm"
          dir="ltr"
        />

        <template #footer>
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-copy"
              label="نسخ النص"
              @click="copyPrompt"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
