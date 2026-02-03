<script setup>
import { commonBackendDeps, commonFrontendDeps, commonAiDeps, commonSystemDeps, commonBuildDeps, packageManagerOptions } from '~/schemas/dependencies.schema'

const { state, updateField, needsAI, needsDesktopSystem, needsFrontend, needsBackend, needsDatabase } = useWizardState()

const techSuggestions = computed(() => {
  const suggestions = []
  const ts = state.value.techStack

  if (ts.database === 'PostgreSQL' && !state.value.backendDependencies.includes('pg'))
    suggestions.push({ dep: 'pg', type: 'backendDependencies', reason: 'PostgreSQL' })
  if (ts.database === 'MySQL' && !state.value.backendDependencies.includes('mysql2'))
    suggestions.push({ dep: 'mysql2', type: 'backendDependencies', reason: 'MySQL' })
  if (ts.database === 'MongoDB' && !state.value.backendDependencies.includes('mongoose'))
    suggestions.push({ dep: 'mongoose', type: 'backendDependencies', reason: 'MongoDB' })
  if (ts.database === 'SQLite' && !state.value.backendDependencies.includes('better-sqlite3'))
    suggestions.push({ dep: 'better-sqlite3', type: 'backendDependencies', reason: 'SQLite' })

  if (ts.auth === 'JWT' && !state.value.backendDependencies.includes('jsonwebtoken'))
    suggestions.push({ dep: 'jsonwebtoken', type: 'backendDependencies', reason: 'JWT' })
  if (ts.auth === 'JWT' && !state.value.backendDependencies.includes('bcryptjs'))
    suggestions.push({ dep: 'bcryptjs', type: 'backendDependencies', reason: 'JWT' })

  if (ts.backend === 'Express.js' && !state.value.backendDependencies.includes('express'))
    suggestions.push({ dep: 'express', type: 'backendDependencies', reason: 'Express.js' })
  if (ts.backend === 'Fastify' && !state.value.backendDependencies.includes('fastify'))
    suggestions.push({ dep: 'fastify', type: 'backendDependencies', reason: 'Fastify' })

  if (ts.orm === 'Prisma' && !state.value.backendDependencies.includes('prisma'))
    suggestions.push({ dep: 'prisma', type: 'backendDependencies', reason: 'Prisma' })
  if (ts.orm === 'Drizzle' && !state.value.backendDependencies.includes('drizzle-orm'))
    suggestions.push({ dep: 'drizzle-orm', type: 'backendDependencies', reason: 'Drizzle' })

  if (state.value.runtimeTargets?.includes('desktop') && !state.value.systemDependencies?.includes('@tauri-apps/api'))
    suggestions.push({ dep: '@tauri-apps/api', type: 'systemDependencies', reason: 'Desktop' })

  return suggestions
})

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
  let minLength = 0
  if (type === 'backendDependencies' && needsBackend.value) minLength = 1
  if (type === 'frontendDependencies' && needsFrontend.value) minLength = 1
  if (state.value[type].length > minLength) {
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
    <!-- Tech Stack Suggestions -->
    <UAlert
      v-if="techSuggestions.length > 0"
      color="info"
      variant="subtle"
      icon="i-lucide-lightbulb"
    >
      <template #title>
        توصيات بناءً على اختياراتك
      </template>
      <template #description>
        <div class="flex flex-wrap gap-2 mt-2">
          <UButton
            v-for="s in techSuggestions"
            :key="s.dep"
            size="xs"
            variant="soft"
            @click="addCommonDep(s.type, s.dep)"
          >
            + {{ s.dep }}
            <span class="text-gray-400 ms-1">({{ s.reason }})</span>
          </UButton>
        </div>
      </template>
    </UAlert>

    <!-- Package Manager -->
    <div class="space-y-3">
      <UFormField
        label="مدير الحزم (Package Manager)"
        required
      >
        <USelect
          :model-value="state.packageManager"
          :items="packageManagerOptions"
          value-key="value"
          placeholder="اختر مدير الحزم"
          @update:model-value="updateField('packageManager', $event)"
        />
      </UFormField>
      <p class="text-sm text-neutral-500">
        سيتم استخدام هذا في أوامر التثبيت المُولّدة
      </p>
    </div>

    <!-- Backend Dependencies -->
    <template v-if="needsBackend">
      <USeparator />
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
          <div
            v-for="(dep, index) in state.backendDependencies"
            :key="index"
            class="flex gap-1"
          >
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
    </template>

    <!-- Frontend Dependencies -->
    <template v-if="needsFrontend">
      <USeparator />
    </template>
    <div v-if="needsFrontend" class="space-y-3">
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
        <div
          v-for="(dep, index) in state.frontendDependencies"
          :key="index"
          class="flex gap-1"
        >
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

    <!-- AI Dependencies -->
    <template v-if="needsAI">
      <USeparator />
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="font-medium">AI Dependencies</label>
          <UButton
            size="xs"
            variant="soft"
            icon="i-lucide-plus"
            label="إضافة"
            @click="addDep('aiDependencies')"
          />
        </div>

        <div class="flex flex-wrap gap-1 mb-2">
          <UButton
            v-for="dep in commonAiDeps"
            :key="dep"
            size="xs"
            :variant="state.aiDependencies.includes(dep) ? 'solid' : 'ghost'"
            @click="addCommonDep('aiDependencies', dep)"
          >
            {{ dep }}
          </UButton>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="(dep, index) in state.aiDependencies"
            :key="index"
            class="flex gap-1"
          >
            <UInput
              :model-value="dep"
              placeholder="package-name"
              size="sm"
              dir="ltr"
              class="w-40"
              @update:model-value="updateDep('aiDependencies', index, $event)"
            />
            <UButton
              size="sm"
              color="error"
              variant="ghost"
              icon="i-lucide-x"
              @click="removeDep('aiDependencies', index)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- System Dependencies -->
    <template v-if="needsDesktopSystem">
      <USeparator />
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="font-medium">System Dependencies</label>
          <UButton
            size="xs"
            variant="soft"
            icon="i-lucide-plus"
            label="إضافة"
            @click="addDep('systemDependencies')"
          />
        </div>

        <div class="flex flex-wrap gap-1 mb-2">
          <UButton
            v-for="dep in commonSystemDeps"
            :key="dep"
            size="xs"
            :variant="state.systemDependencies.includes(dep) ? 'solid' : 'ghost'"
            @click="addCommonDep('systemDependencies', dep)"
          >
            {{ dep }}
          </UButton>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="(dep, index) in state.systemDependencies"
            :key="index"
            class="flex gap-1"
          >
            <UInput
              :model-value="dep"
              placeholder="package-name"
              size="sm"
              dir="ltr"
              class="w-40"
              @update:model-value="updateDep('systemDependencies', index, $event)"
            />
            <UButton
              size="sm"
              color="error"
              variant="ghost"
              icon="i-lucide-x"
              @click="removeDep('systemDependencies', index)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Build Dependencies -->
    <USeparator />
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="font-medium">Build Dependencies</label>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-plus"
          label="إضافة"
          @click="addDep('buildDependencies')"
        />
      </div>

      <div class="flex flex-wrap gap-1 mb-2">
        <UButton
          v-for="dep in commonBuildDeps"
          :key="dep"
          size="xs"
          :variant="state.buildDependencies.includes(dep) ? 'solid' : 'ghost'"
          @click="addCommonDep('buildDependencies', dep)"
        >
          {{ dep }}
        </UButton>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="(dep, index) in state.buildDependencies"
          :key="index"
          class="flex gap-1"
        >
          <UInput
            :model-value="dep"
            placeholder="package-name"
            size="sm"
            dir="ltr"
            class="w-40"
            @update:model-value="updateDep('buildDependencies', index, $event)"
          />
          <UButton
            size="sm"
            color="error"
            variant="ghost"
            icon="i-lucide-x"
            @click="removeDep('buildDependencies', index)"
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
          <UFormField
            label="الاسم"
            required
          >
            <UInput
              :model-value="envVar.name"
              placeholder="DB_HOST"
              dir="ltr"
              @update:model-value="updateEnvVar(index, 'name', $event)"
            />
          </UFormField>

          <UFormField
            label="مثال"
            required
          >
            <UInput
              :model-value="envVar.example"
              placeholder="localhost"
              dir="ltr"
              @update:model-value="updateEnvVar(index, 'example', $event)"
            />
          </UFormField>

          <UFormField
            label="الوصف"
            required
            class="md:col-span-2"
          >
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

    <!-- Seed Data -->
    <template v-if="needsDatabase">
      <USeparator />
      <UFormField
        label="بيانات تجريبية (Seed Data)"
        name="seedData"
      >
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
    </template>
  </div>
</template>
