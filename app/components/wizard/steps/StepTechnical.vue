<script setup>
import {
  frontendOptions,
  backendOptions,
  databaseOptions,
  authOptions,
  architectureOptions,
  tenancyModelOptions,
  isolationLevelOptions
} from '~/schemas/technical.schema'

const { state, updateNestedField } = useWizardState()

// Reactive arrays للسماح بإضافة خيارات جديدة
const frontendItems = ref([...frontendOptions])
const backendItems = ref([...backendOptions])
const databaseItems = ref([...databaseOptions])
const authItems = ref([...authOptions])

// دوال لإضافة خيار جديد لكل حقل
function onCreateFrontend(value) {
  frontendItems.value.push({ label: value, value })
  updateNestedField('techStack', 'frontend', value)
}

function onCreateBackend(value) {
  backendItems.value.push({ label: value, value })
  updateNestedField('techStack', 'backend', value)
}

function onCreateDatabase(value) {
  databaseItems.value.push({ label: value, value })
  updateNestedField('techStack', 'database', value)
}

function onCreateAuth(value) {
  authItems.value.push({ label: value, value })
  updateNestedField('techStack', 'auth', value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Tech Stack -->
    <div class="space-y-4">
      <h3 class="font-semibold text-gray-900 dark:text-white">التقنيات المستخدمة</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Frontend Framework" required>
          <USelectMenu
            :model-value="state.techStack.frontend"
            :items="frontendItems"
            value-key="value"
            create-item="always"
            placeholder="اختر أو أضف framework"
            :search-input="{ placeholder: 'ابحث أو أضف جديد...' }"
            @update:model-value="updateNestedField('techStack', 'frontend', $event)"
            @create="onCreateFrontend"
          />
        </UFormField>

        <UFormField label="Backend Framework" required>
          <USelectMenu
            :model-value="state.techStack.backend"
            :items="backendItems"
            value-key="value"
            create-item="always"
            placeholder="اختر أو أضف framework"
            :search-input="{ placeholder: 'ابحث أو أضف جديد...' }"
            @update:model-value="updateNestedField('techStack', 'backend', $event)"
            @create="onCreateBackend"
          />
        </UFormField>

        <UFormField label="Database" required>
          <USelectMenu
            :model-value="state.techStack.database"
            :items="databaseItems"
            value-key="value"
            create-item="always"
            placeholder="اختر أو أضف database"
            :search-input="{ placeholder: 'ابحث أو أضف جديد...' }"
            @update:model-value="updateNestedField('techStack', 'database', $event)"
            @create="onCreateDatabase"
          />
        </UFormField>

        <UFormField label="Authentication" required>
          <USelectMenu
            :model-value="state.techStack.auth"
            :items="authItems"
            value-key="value"
            create-item="always"
            placeholder="اختر أو أضف auth method"
            :search-input="{ placeholder: 'ابحث أو أضف جديد...' }"
            @update:model-value="updateNestedField('techStack', 'auth', $event)"
            @create="onCreateAuth"
          />
        </UFormField>
      </div>
    </div>

    <USeparator />

    <!-- Architecture -->
    <UFormField label="نمط البنية" name="architecture" required>
      <URadioGroup
        v-model="state.architecture"
        :items="architectureOptions"
        class="flex flex-col gap-2"
      />
    </UFormField>

    <USeparator />

    <!-- Multi-tenancy -->
    <div class="space-y-4">
      <UFormField label="تعدد المستأجرين (Multi-tenancy)">
        <USwitch
          :model-value="state.multiTenancy.enabled"
          label="تفعيل Multi-tenancy"
          @update:model-value="updateNestedField('multiTenancy', 'enabled', $event)"
        />
        <template #hint>
          <span class="text-xs text-gray-500">للمشاريع التي تخدم عدة عملاء/شركات منفصلة</span>
        </template>
      </UFormField>

      <template v-if="state.multiTenancy.enabled">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <UFormField label="نموذج التفريق" required>
            <USelect
              :model-value="state.multiTenancy.model"
              :items="tenancyModelOptions"
              placeholder="اختر النموذج"
              @update:model-value="updateNestedField('multiTenancy', 'model', $event)"
            />
          </UFormField>

          <UFormField label="مستوى العزل" required>
            <USelect
              :model-value="state.multiTenancy.isolationLevel"
              :items="isolationLevelOptions"
              placeholder="اختر المستوى"
              @update:model-value="updateNestedField('multiTenancy', 'isolationLevel', $event)"
            />
          </UFormField>
        </div>
      </template>
    </div>
  </div>
</template>
