<script setup>
const { state, updateField, requiresExtendedFeatures } = useWizardState()

const emptyEdgeCase = {
  scenario: '',
  handling: ''
}

const emptyPhase = {
  phaseName: '',
  tasks: ['']
}

// Update feature
function updateFeature(type, index, value) {
  const newFeatures = [...state.value[type]]
  newFeatures[index] = value
  updateField(type, newFeatures)
}

// Add feature
function addFeature(type) {
  updateField(type, [...state.value[type], ''])
}

// Remove feature
function removeFeature(type, index) {
  if (state.value[type].length > 1 || type === 'futureFeatures') {
    const newFeatures = state.value[type].filter((_, i) => i !== index)
    updateField(type, newFeatures)
  }
}

// Update edge case
function updateEdgeCase(index, field, value) {
  const newEdgeCases = [...state.value.edgeCases]
  newEdgeCases[index][field] = value
  updateField('edgeCases', newEdgeCases)
}

// Update phase
function updatePhaseName(index, name) {
  const newPhases = [...state.value.implementationPhases]
  newPhases[index].phaseName = name
  updateField('implementationPhases', newPhases)
}

// Update phase task
function updatePhaseTask(phaseIndex, taskIndex, value) {
  const newPhases = [...state.value.implementationPhases]
  newPhases[phaseIndex].tasks[taskIndex] = value
  updateField('implementationPhases', newPhases)
}

// Add task to phase
function addTask(phaseIndex) {
  const newPhases = [...state.value.implementationPhases]
  newPhases[phaseIndex].tasks.push('')
  updateField('implementationPhases', newPhases)
}

// Remove task from phase
function removeTask(phaseIndex, taskIndex) {
  if (state.value.implementationPhases[phaseIndex].tasks.length > 1) {
    const newPhases = [...state.value.implementationPhases]
    newPhases[phaseIndex].tasks.splice(taskIndex, 1)
    updateField('implementationPhases', newPhases)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- MVP Features -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="font-medium">مميزات النسخة الأولى (MVP)</label>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-plus"
          label="إضافة"
          @click="addFeature('mvpFeatures')"
        />
      </div>

      <div v-for="(feature, index) in state.mvpFeatures" :key="index" class="flex gap-2">
        <UInput
          :model-value="feature"
          placeholder="وصف الميزة"
          class="flex-1"
          @update:model-value="updateFeature('mvpFeatures', index, $event)"
        />
        <UButton
          v-if="state.mvpFeatures.length > 1"
          size="sm"
          color="error"
          variant="ghost"
          icon="i-lucide-x"
          @click="removeFeature('mvpFeatures', index)"
        />
      </div>
    </div>

    <USeparator />

    <!-- Future Features -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="font-medium text-gray-600 dark:text-gray-400">مميزات مستقبلية (اختياري)</label>
        <UButton
          size="xs"
          variant="soft"
          icon="i-lucide-plus"
          label="إضافة"
          @click="addFeature('futureFeatures')"
        />
      </div>

      <div v-for="(feature, index) in state.futureFeatures" :key="index" class="flex gap-2">
        <UInput
          :model-value="feature"
          placeholder="وصف الميزة المستقبلية"
          class="flex-1"
          @update:model-value="updateFeature('futureFeatures', index, $event)"
        />
        <UButton
          size="sm"
          color="error"
          variant="ghost"
          icon="i-lucide-x"
          @click="removeFeature('futureFeatures', index)"
        />
      </div>

      <p v-if="state.futureFeatures.length === 0" class="text-sm text-gray-500">
        لا توجد مميزات مستقبلية مضافة
      </p>
    </div>

    <!-- Extended sections for medium/large projects -->
    <template v-if="requiresExtendedFeatures">
      <USeparator />

      <!-- Wireframes -->
      <UFormField label="رسومات الشاشات (Wireframes)" name="wireframes">
        <UTextarea
          v-model="state.wireframes"
          placeholder="اكتب وصف نصي للشاشات الرئيسية أو استخدم ASCII art"
          :rows="4"
          autoresize
        />
      </UFormField>

      <USeparator />

      <!-- Edge Cases -->
      <FormDynamicArrayField
        v-model="state.edgeCases"
        label="الحالات الاستثنائية"
        add-label="إضافة حالة"
        :empty-item="emptyEdgeCase"
        :min-items="0"
      >
        <template #default="{ item: edgeCase, index }">
          <div class="space-y-2">
            <UFormField label="السيناريو">
              <UInput
                :model-value="edgeCase.scenario"
                placeholder="ماذا لو المخزون = 0؟"
                @update:model-value="updateEdgeCase(index, 'scenario', $event)"
              />
            </UFormField>
            <UFormField label="المعالجة">
              <UInput
                :model-value="edgeCase.handling"
                placeholder="منع البيع وإظهار تحذير"
                @update:model-value="updateEdgeCase(index, 'handling', $event)"
              />
            </UFormField>
          </div>
        </template>
      </FormDynamicArrayField>

      <USeparator />

      <!-- Implementation Phases -->
      <FormDynamicArrayField
        v-model="state.implementationPhases"
        label="مراحل التنفيذ"
        add-label="إضافة مرحلة"
        :empty-item="emptyPhase"
        :min-items="0"
      >
        <template #default="{ item: phase, index: phaseIndex }">
          <div class="space-y-3">
            <UFormField label="اسم المرحلة" required>
              <UInput
                :model-value="phase.phaseName"
                placeholder="مثال: Foundation، Core Features"
                @update:model-value="updatePhaseName(phaseIndex, $event)"
              />
            </UFormField>

            <div class="space-y-2 pr-4 border-r-2 border-primary-200 dark:border-primary-800">
              <div class="flex items-center justify-between">
                <label class="text-sm text-gray-600 dark:text-gray-400">المهام</label>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-lucide-plus"
                  @click="addTask(phaseIndex)"
                />
              </div>

              <div v-for="(task, taskIndex) in phase.tasks" :key="taskIndex" class="flex gap-2">
                <UInput
                  :model-value="task"
                  placeholder="وصف المهمة"
                  size="sm"
                  class="flex-1"
                  @update:model-value="updatePhaseTask(phaseIndex, taskIndex, $event)"
                />
                <UButton
                  v-if="phase.tasks.length > 1"
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-x"
                  @click="removeTask(phaseIndex, taskIndex)"
                />
              </div>
            </div>
          </div>
        </template>
      </FormDynamicArrayField>
    </template>

    <UAlert
      v-else
      icon="i-lucide-info"
      color="primary"
      variant="subtle"
      title="ملاحظة"
      description="الأقسام المتقدمة (Wireframes, Edge Cases, Phases) تظهر فقط للمشاريع المتوسطة والكبيرة. يمكنك تغيير حجم المشروع من الخطوة الأولى."
    />
  </div>
</template>
