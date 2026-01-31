<script setup>
import { aiDomainOptions, hardwarePreferenceOptions } from '~/types/wizard.types'

const { state, updateNestedField } = useWizardState()

const commonModels = [
  { name: 'GPT-4o', isOpenSource: false, isAPI: true, offlineSupport: false },
  { name: 'Claude 3.5 Sonnet', isOpenSource: false, isAPI: true, offlineSupport: false },
  { name: 'Gemini Pro', isOpenSource: false, isAPI: true, offlineSupport: false },
  { name: 'Llama 3', isOpenSource: true, isAPI: false, offlineSupport: true },
  { name: 'Mistral', isOpenSource: true, isAPI: true, offlineSupport: true },
  { name: 'Whisper', isOpenSource: true, isAPI: true, offlineSupport: true }
]

const emptyModel = { name: '', isOpenSource: false, isAPI: true, offlineSupport: false }

function toggleDomain(domain) {
  const current = [...(state.value.aiConfiguration.domains || [])]
  const idx = current.indexOf(domain)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(domain)
  }
  updateNestedField('aiConfiguration', 'domains', current)
}

function addModel(model) {
  const exists = state.value.aiConfiguration.models.some(m => m.name === model.name)
  if (!exists) {
    updateNestedField('aiConfiguration', 'models', [...state.value.aiConfiguration.models, { ...model }])
  }
}

function removeModel(index) {
  const updated = [...state.value.aiConfiguration.models]
  updated.splice(index, 1)
  updateNestedField('aiConfiguration', 'models', updated)
}

function updateModel(index, field, value) {
  const updated = state.value.aiConfiguration.models.map((m, i) =>
    i === index ? { ...m, [field]: value } : m
  )
  updateNestedField('aiConfiguration', 'models', updated)
}

const newLanguage = ref('')

function addLanguage() {
  if (newLanguage.value.trim()) {
    updateNestedField('aiConfiguration', 'supportedLanguages', [
      ...state.value.aiConfiguration.supportedLanguages,
      newLanguage.value.trim()
    ])
    newLanguage.value = ''
  }
}

function removeLanguage(index) {
  const updated = [...state.value.aiConfiguration.supportedLanguages]
  updated.splice(index, 1)
  updateNestedField('aiConfiguration', 'supportedLanguages', updated)
}
</script>

<template>
  <div class="space-y-6">
    <p class="text-sm text-gray-500">
      حدد مجالات الذكاء الاصطناعي والنماذج التي يستخدمها مشروعك.
      هذه الإعدادات تُضاف إلى ملف المواصفات لتوجيه بناء المشروع.
    </p>

    <!-- AI Domains -->
    <UFormField
      label="مجالات الذكاء الاصطناعي"
      name="aiDomains"
      required
    >
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <UCard
          v-for="domain in aiDomainOptions"
          :key="domain.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.aiConfiguration.domains?.includes(domain.value) ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="toggleDomain(domain.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="domain.icon"
              class="text-2xl"
              :class="state.aiConfiguration.domains?.includes(domain.value) ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-sm">
                {{ domain.label }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ domain.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>

    <USeparator />

    <!-- AI Models -->
    <UFormField
      label="نماذج الذكاء الاصطناعي"
      name="aiModels"
      required
    >
      <div class="space-y-3">
        <!-- Quick Add -->
        <div class="flex flex-wrap gap-2 mb-3">
          <UButton
            v-for="model in commonModels"
            :key="model.name"
            size="xs"
            variant="soft"
            :disabled="state.aiConfiguration.models.some(m => m.name === model.name)"
            @click="addModel(model)"
          >
            + {{ model.name }}
          </UButton>
        </div>

        <!-- Models List -->
        <div
          v-for="(model, index) in state.aiConfiguration.models"
          :key="index"
          class="border rounded-lg p-3 space-y-3"
        >
          <div class="flex items-center justify-between">
            <UInput
              :model-value="model.name"
              placeholder="اسم النموذج"
              class="flex-1 me-2"
              @update:model-value="updateModel(index, 'name', $event)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="removeModel(index)"
            />
          </div>
          <div class="flex flex-wrap gap-4">
            <UCheckbox
              :model-value="model.isOpenSource"
              label="مفتوح المصدر"
              @update:model-value="updateModel(index, 'isOpenSource', $event)"
            />
            <UCheckbox
              :model-value="model.isAPI"
              label="عبر API"
              @update:model-value="updateModel(index, 'isAPI', $event)"
            />
            <UCheckbox
              :model-value="model.offlineSupport"
              label="يعمل بدون إنترنت"
              @update:model-value="updateModel(index, 'offlineSupport', $event)"
            />
          </div>
        </div>

        <!-- Add Empty Model -->
        <UButton
          icon="i-lucide-plus"
          variant="soft"
          block
          @click="addModel({ ...emptyModel })"
        >
          إضافة نموذج
        </UButton>
      </div>
    </UFormField>

    <USeparator />

    <!-- Supported Languages -->
    <UFormField
      label="اللغات المدعومة (للنماذج)"
      name="supportedLanguages"
    >
      <div class="space-y-2">
        <div class="flex gap-2">
          <UInput
            v-model="newLanguage"
            placeholder="مثال: العربية، English"
            class="flex-1"
            @keyup.enter="addLanguage"
          />
          <UButton
            icon="i-lucide-plus"
            @click="addLanguage"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="(lang, index) in state.aiConfiguration.supportedLanguages"
            :key="index"
            variant="subtle"
            class="cursor-pointer"
            @click="removeLanguage(index)"
          >
            {{ lang }} ×
          </UBadge>
        </div>
      </div>
    </UFormField>

    <USeparator />

    <!-- Hardware Preference -->
    <UFormField
      label="تفضيل العتاد"
      name="hardwarePreference"
      required
    >
      <div class="grid grid-cols-3 gap-3">
        <UCard
          v-for="pref in hardwarePreferenceOptions"
          :key="pref.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.aiConfiguration.hardwarePreference === pref.value ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="updateNestedField('aiConfiguration', 'hardwarePreference', pref.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="pref.icon"
              class="text-2xl"
              :class="state.aiConfiguration.hardwarePreference === pref.value ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-sm">
                {{ pref.label }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ pref.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>
  </div>
</template>
