<script setup>
import { commonBackendDeps, commonFrontendDeps } from '~/schemas/dependencies.schema'

const { state, updateField } = useWizardState()

const emptyEnvVar = {
  name: '',
  description: '',
  required: true,
  example: ''
}

// Update dependency
function updateDep(type, index, value) {
  const newDeps = [...state.value[type]]
  newDeps[index] = value
  updateField(type, newDeps)
}

// Add dependency
function addDep(type) {
  updateField(type, [...state.value[type], ''])
}

// Remove dependency
function removeDep(type, index) {
  if (state.value[type].length > 1) {
    const newDeps = state.value[type].filter((_, i) => i !== index)
    updateField(type, newDeps)
  }
}

// Add common dependency
function addCommonDep(type, dep) {
  if (!state.value[type].includes(dep)) {
    updateField(type, [...state.value[type].filter(d => d), dep])
  }
}

// Update env variable
function updateEnvVar(index, field, value) {
  const newEnvVars = [...state.value.environmentVariables]
  newEnvVars[index][field] = value
  updateField('environmentVariables', newEnvVars)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Backend Dependencies -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="font-medium">Backend Dependencies</label>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-plus"
          label="إضافة"
          @click="addDep('backendDependencies')"
        />
      </div>

      <div class="flex flex-wrap gap-1 mb-2">
        <UButton
          v-for="dep in commonBackendDeps"
          :key="dep"
          size="xs"
          :variant="state.backendDependencies.includes(dep) ? 'solid' : 'ghost'"
          @click="addCommonDep('backendDependencies', dep)"
        >
          {{ dep }}
        </UButton>
      </div>

      <div class="flex flex-wrap gap-2">
        <div v-for="(dep, index) in state.backendDependencies" :key="index" class="flex gap-1">
          <UInput
            :model-value="dep"
            placeholder="package-name"
            size="sm"
            dir="ltr"
            class="w-40"
            @update:model-value="updateDep('backendDependencies', index, $event)"
          />
          <UButton
            v-if="state.backendDependencies.length > 1"
            size="sm"
            color="error"
            variant="ghost"
            icon="i-lucide-x"
            @click="removeDep('backendDependencies', index)"
          />
        </div>
      </div>
    </div>

    <USeparator />

    <!-- Frontend Dependencies -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="font-medium">Frontend Dependencies</label>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-plus"
          label="إضافة"
          @click="addDep('frontendDependencies')"
        />
      </div>

      <div class="flex flex-wrap gap-1 mb-2">
        <UButton
          v-for="dep in commonFrontendDeps"
          :key="dep"
          size="xs"
          :variant="state.frontendDependencies.includes(dep) ? 'solid' : 'ghost'"
          @click="addCommonDep('frontendDependencies', dep)"
        >
          {{ dep }}
        </UButton>
      </div>

      <div class="flex flex-wrap gap-2">
        <div v-for="(dep, index) in state.frontendDependencies" :key="index" class="flex gap-1">
          <UInput
            :model-value="dep"
            placeholder="package-name"
            size="sm"
            dir="ltr"
            class="w-40"
            @update:model-value="updateDep('frontendDependencies', index, $event)"
          />
          <UButton
            v-if="state.frontendDependencies.length > 1"
            size="sm"
            color="error"
            variant="ghost"
            icon="i-lucide-x"
            @click="removeDep('frontendDependencies', index)"
          />
        </div>
      </div>
    </div>

    <USeparator />

    <!-- Environment Variables -->
    <FormDynamicArrayField
      v-model="state.environmentVariables"
      label="متغيرات البيئة (.env)"
      add-label="إضافة متغير"
      :empty-item="emptyEnvVar"
    >
      <template #default="{ item: envVar, index }">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <UFormField label="الاسم" required>
            <UInput
              :model-value="envVar.name"
              placeholder="DB_HOST"
              dir="ltr"
              @update:model-value="updateEnvVar(index, 'name', $event)"
            />
          </UFormField>

          <UFormField label="مثال" required>
            <UInput
              :model-value="envVar.example"
              placeholder="localhost"
              dir="ltr"
              @update:model-value="updateEnvVar(index, 'example', $event)"
            />
          </UFormField>

          <UFormField label="الوصف" required class="md:col-span-2">
            <div class="flex gap-2">
              <UInput
                :model-value="envVar.description"
                placeholder="وصف المتغير"
                class="flex-1"
                @update:model-value="updateEnvVar(index, 'description', $event)"
              />
              <USwitch
                :model-value="envVar.required"
                label="مطلوب"
                @update:model-value="updateEnvVar(index, 'required', $event)"
              />
            </div>
          </UFormField>
        </div>
      </template>
    </FormDynamicArrayField>

    <USeparator />

    <!-- Seed Data -->
    <UFormField label="بيانات تجريبية (Seed Data)" name="seedData">
      <UTextarea
        v-model="state.seedData"
        placeholder="اكتب بيانات تجريبية للاختبار، مثال:
Users:
- name: أحمد, email: ahmed@test.com, password: 123456

Products:
- name: لابتوب HP, price: 15000, stock: 10"
        :rows="4"
        autoresize
      />
    </UFormField>
  </div>
</template>
