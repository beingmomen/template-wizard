<script setup>
import { projectTypeOptions } from '~/schemas/quickReference.schema'
import { projectNatureOptions, runtimeTargetOptions, intelligenceLevelOptions } from '~/types/wizard.types'

const { state, updateField } = useWizardState()

function toggleRuntimeTarget(target) {
  const current = [...(state.value.runtimeTargets || [])]
  const idx = current.indexOf(target)
  if (idx >= 0) {
    if (current.length > 1) current.splice(idx, 1)
  } else {
    current.push(target)
  }
  updateField('runtimeTargets', current)
}

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
  { label: 'عربي', value: 'ar', dir: 'RTL', icon: 'i-lucide-text-cursor-input', desc: 'واجهة من اليمين لليسار (RTL)' },
  { label: 'إنجليزي', value: 'en', dir: 'LTR', icon: 'i-lucide-text-cursor-input', desc: 'واجهة من اليسار لليمين (LTR)' },
  { label: 'كلاهما (i18n)', value: 'both', dir: 'RTL + LTR', icon: 'i-lucide-languages', desc: 'دعم متعدد اللغات مع @nuxtjs/i18n' }
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
    <!-- Section 1: Project Classification -->
    <div class="space-y-1">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">
        تصنيف المشروع
      </h3>
      <p class="text-xs text-gray-500">
        هذه الاختيارات تحدد الخطوات التي ستظهر لك في المعالج
      </p>
    </div>

    <!-- Project Type -->
    <UFormField
      label="نوع المشروع"
      name="projectType"
      required
    >
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <UCard
          v-for="type in projectTypeOptions"
          :key="type.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.projectType === type.value ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="updateField('projectType', type.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="type.icon"
              class="text-2xl"
              :class="state.projectType === type.value ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-sm">
                {{ type.labelAr }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ type.descAr }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>

    <!-- Project Nature -->
    <UFormField
      label="طبيعة المشروع"
      name="projectNature"
      required
    >
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <UCard
          v-for="nature in projectNatureOptions"
          :key="nature.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.projectNature === nature.value ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="updateField('projectNature', nature.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="nature.icon"
              class="text-2xl"
              :class="state.projectNature === nature.value ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-sm">
                {{ nature.label }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ nature.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>

    <!-- Runtime Targets -->
    <UFormField
      label="بيئات التشغيل"
      name="runtimeTargets"
      required
    >
      <p class="text-xs text-gray-500 mb-2">
        يمكنك اختيار أكثر من بيئة
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <UCard
          v-for="target in runtimeTargetOptions"
          :key="target.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.runtimeTargets?.includes(target.value) ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="toggleRuntimeTarget(target.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="target.icon"
              class="text-2xl"
              :class="state.runtimeTargets?.includes(target.value) ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-sm">
                {{ target.label }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ target.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>

    <!-- Intelligence Level -->
    <UFormField
      label="مستوى الذكاء الاصطناعي"
      name="intelligenceLevel"
      required
    >
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <UCard
          v-for="level in intelligenceLevelOptions"
          :key="level.value"
          class="cursor-pointer transition-all hover:shadow-md"
          :class="state.intelligenceLevel === level.value ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
          :ui="{ body: 'p-3' }"
          @click="updateField('intelligenceLevel', level.value)"
        >
          <div class="flex flex-col items-center text-center gap-2">
            <UIcon
              :name="level.icon"
              class="text-2xl"
              :class="state.intelligenceLevel === level.value ? 'text-primary' : 'text-gray-500'"
            />
            <div>
              <p class="font-medium text-sm">
                {{ level.label }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ level.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UFormField>

    <USeparator />

    <!-- Section 2: Project Info -->
    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
      معلومات المشروع
    </h3>

    <!-- Project Size -->
    <UFormField
      label="حجم المشروع"
      name="projectSize"
      required
    >
      <URadioGroup
        v-model="state.projectSize"
        :items="sizeOptions"
        class="flex flex-wrap gap-4"
      />
    </UFormField>

    <!-- Project Names -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField
        label="اسم المشروع"
        name="projectName"
        required
      >
        <UInput
          v-model="state.projectName"
          placeholder="مثال: نظام إدارة المخزون"
        />
      </UFormField>

      <UFormField
        label="الاسم التقني (بالإنجليزية)"
        name="projectNameTechnical"
        required
      >
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
    <UFormField
      label="وصف المشكلة"
      name="problemStatement"
      required
    >
      <UTextarea
        v-model="state.problemStatement"
        placeholder="ما المشكلة التي يحلها المشروع؟ من يعاني منها؟"
        :rows="4"
        autoresize
      />
    </UFormField>

    <!-- Solution Description -->
    <UFormField
      label="وصف الحل"
      name="solutionDescription"
      required
    >
      <UTextarea
        v-model="state.solutionDescription"
        placeholder="كيف يحل المشروع هذه المشكلة؟ ما الذي يميز حلك؟"
        :rows="4"
        autoresize
      />
    </UFormField>

    <!-- Target Users -->
    <UFormField
      label="المستخدمين المستهدفين"
      name="targetUsers"
      required
    >
      <UTextarea
        v-model="state.targetUsers"
        placeholder="من سيستخدم المشروع؟ صف الفئة المستهدفة بالتفصيل"
        :rows="4"
        autoresize
      />
    </UFormField>

    <USeparator />

    <!-- Section 3: Users & Language -->
    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
      المستخدمون واللغة
    </h3>

    <!-- User Type & Level -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField
        label="نوع المستخدم"
        name="targetUserType"
      >
        <USelect
          v-model="state.targetUserType"
          :items="userTypeOptions"
        />
      </UFormField>

      <UFormField
        label="المستوى التقني للمستخدم"
        name="targetUserLevel"
      >
        <USelect
          v-model="state.targetUserLevel"
          :items="levelOptions"
        />
        <p class="text-xs text-gray-500 mt-1">
          مستوى الخبرة التقنية للمستخدم النهائي (يؤثر على تعقيد الواجهة)
        </p>
      </UFormField>
    </div>

    <!-- Language Selection Cards -->
    <UFormField
      label="اللغة الأساسية للمشروع"
      name="primaryLanguage"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          v-for="lang in languageOptions"
          :key="lang.value"
          class="relative cursor-pointer rounded-xl border-2 p-4 transition-all"
          :class="state.primaryLanguage === lang.value
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'"
          @click="updateField('primaryLanguage', lang.value)"
        >
          <div
            v-if="state.primaryLanguage === lang.value"
            class="absolute top-3 start-3"
          >
            <UIcon
              name="i-lucide-check-circle-2"
              class="w-5 h-5 text-primary-500"
            />
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              :class="state.primaryLanguage === lang.value ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'"
            >
              <UIcon
                :name="lang.icon"
                class="w-4.5 h-4.5"
                :class="state.primaryLanguage === lang.value ? 'text-primary-500' : 'text-gray-500'"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-sm text-gray-900 dark:text-white">{{ lang.label }}</span>
                <UBadge
                  size="xs"
                  variant="subtle"
                  :color="state.primaryLanguage === lang.value ? 'primary' : 'neutral'"
                >
                  {{ lang.dir }}
                </UBadge>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ lang.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UFormField>

    <UAlert
      v-if="state.primaryLanguage === 'both'"
      color="info"
      variant="subtle"
      icon="i-lucide-info"
      title="دعم متعدد اللغات"
      description="المشروع يحتاج @nuxtjs/i18n مع Nuxt UI locale support. استخدم useHead لتغيير dir و lang ديناميكياً حسب لغة المستخدم."
    />
  </div>
</template>
