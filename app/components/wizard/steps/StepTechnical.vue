<script setup>
import {
  frontendOptions,
  backendOptions,
  databaseOptions,
  authOptions,
  runtimeOptions,
  uiLibraryOptions,
  architectureOptions,
  tenancyModelOptions,
  isolationLevelOptions,
  externalServiceTypeOptions
} from '~/schemas/technical.schema'
import { AVAILABLE_MCP_SERVERS, TECH_TO_MCP_MAP } from '~/types/wizard.types'

const { state, updateField, updateNestedField } = useWizardState()

const needsFrontend = computed(() =>
  ['fullstack', 'frontend-only', 'chrome-extension'].includes(state.value.projectType)
)

const needsBackend = computed(() =>
  ['fullstack', 'backend-only'].includes(state.value.projectType)
)

const needsDatabase = computed(() =>
  ['fullstack', 'backend-only'].includes(state.value.projectType)
)

const needsAuth = computed(() =>
  ['fullstack', 'backend-only'].includes(state.value.projectType)
)

const needsRuntime = computed(() =>
  ['cli-tool', 'library', 'backend-only'].includes(state.value.projectType)
)

const showTechStack = computed(() =>
  needsFrontend.value || needsBackend.value || needsDatabase.value || needsAuth.value
)

const showExternalServices = computed(() =>
  ['fullstack', 'frontend-only', 'backend-only', 'integration'].includes(state.value.projectType)
)

const frontendItems = ref([...frontendOptions])
const backendItems = ref([...backendOptions])
const databaseItems = ref([...databaseOptions])
const authItems = ref([...authOptions])
const runtimeItems = ref([...runtimeOptions])
const uiLibraryItems = ref([...uiLibraryOptions])

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

function onCreateRuntime(value) {
  runtimeItems.value.push({ label: value, value })
  updateNestedField('techStack', 'runtime', value)
}

function onCreateUiLibrary(value) {
  uiLibraryItems.value.push({ label: value, value })
  updateNestedField('techStack', 'uiLibrary', value)
}

function addExternalService() {
  const newService = {
    name: '',
    type: 'AI',
    apiUrl: '',
    description: '',
    envVars: []
  }
  updateField('externalServices', [...state.value.externalServices, newService])
}

function removeExternalService(index) {
  const services = [...state.value.externalServices]
  services.splice(index, 1)
  updateField('externalServices', services)
}

function updateExternalService(index, field, value) {
  const services = [...state.value.externalServices]
  services[index] = { ...services[index], [field]: value }
  updateField('externalServices', services)
}

function addEnvVar(serviceIndex) {
  const services = [...state.value.externalServices]
  services[serviceIndex].envVars = [...services[serviceIndex].envVars, '']
  updateField('externalServices', services)
}

function updateEnvVar(serviceIndex, varIndex, value) {
  const services = [...state.value.externalServices]
  services[serviceIndex].envVars[varIndex] = value
  updateField('externalServices', services)
}

function removeEnvVar(serviceIndex, varIndex) {
  const services = [...state.value.externalServices]
  services[serviceIndex].envVars.splice(varIndex, 1)
  updateField('externalServices', services)
}

const mcpServers = computed(() => AVAILABLE_MCP_SERVERS)

function isServerSelected(serverId) {
  return state.value.selectedMcpServers?.includes(serverId) || false
}

function toggleServer(serverId) {
  const current = state.value.selectedMcpServers || []
  if (current.includes(serverId)) {
    updateField('selectedMcpServers', current.filter(id => id !== serverId))
  } else {
    updateField('selectedMcpServers', [...current, serverId])
  }
}

function autoSelectMcpServers() {
  const selectedTechs = [
    state.value.techStack.frontend,
    state.value.techStack.backend,
    state.value.techStack.uiLibrary,
    state.value.techStack.runtime
  ].filter(Boolean)

  const mcpIds = new Set()
  selectedTechs.forEach(tech => {
    const servers = TECH_TO_MCP_MAP[tech] || []
    servers.forEach(id => mcpIds.add(id))
  })

  updateField('selectedMcpServers', Array.from(mcpIds))
}

function getRelatedTechBadgeColor(tech) {
  const selectedTechs = [
    state.value.techStack.frontend,
    state.value.techStack.backend,
    state.value.techStack.uiLibrary
  ]
  return selectedTechs.includes(tech) ? 'success' : 'neutral'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Tech Stack -->
    <div v-if="showTechStack" class="space-y-4">
      <h3 class="font-semibold text-gray-900 dark:text-white">التقنيات المستخدمة</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField v-if="needsFrontend" label="Frontend Framework" :required="needsFrontend">
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

        <UFormField v-if="needsBackend" label="Backend Framework" :required="needsBackend">
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

        <UFormField v-if="needsDatabase" label="Database" :required="needsDatabase">
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

        <UFormField v-if="needsAuth" label="Authentication" :required="needsAuth">
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

        <UFormField v-if="needsFrontend" label="UI Library">
          <USelectMenu
            :model-value="state.techStack.uiLibrary"
            :items="uiLibraryItems"
            value-key="value"
            create-item="always"
            placeholder="اختر مكتبة UI"
            :search-input="{ placeholder: 'ابحث أو أضف جديد...' }"
            @update:model-value="updateNestedField('techStack', 'uiLibrary', $event)"
            @create="onCreateUiLibrary"
          />
        </UFormField>

        <UFormField v-if="needsRuntime" label="Runtime">
          <USelectMenu
            :model-value="state.techStack.runtime"
            :items="runtimeItems"
            value-key="value"
            create-item="always"
            placeholder="اختر Runtime"
            :search-input="{ placeholder: 'ابحث أو أضف جديد...' }"
            @update:model-value="updateNestedField('techStack', 'runtime', $event)"
            @create="onCreateRuntime"
          />
        </UFormField>
      </div>
    </div>

    <USeparator v-if="showTechStack" />

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
    <div v-if="needsBackend" class="space-y-4">
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

      <USeparator />
    </div>

    <!-- External Services -->
    <div v-if="showExternalServices" class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">الخدمات الخارجية</h3>
        <UButton
          size="sm"
          variant="soft"
          icon="i-lucide-plus"
          @click="addExternalService"
        >
          إضافة خدمة
        </UButton>
      </div>

      <p class="text-sm text-gray-500">
        أضف الخدمات الخارجية التي سيتكامل معها المشروع (AI APIs, Payment Gateways, etc.)
      </p>

      <div v-if="state.externalServices.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <UIcon name="i-lucide-plug" class="text-4xl text-gray-400 mb-2" />
        <p class="text-gray-500">لا توجد خدمات خارجية</p>
        <UButton
          size="sm"
          variant="link"
          @click="addExternalService"
        >
          إضافة خدمة خارجية
        </UButton>
      </div>

      <div v-for="(service, index) in state.externalServices" :key="index" class="p-4 border rounded-lg space-y-4">
        <div class="flex items-start justify-between">
          <span class="text-sm font-medium text-gray-500">خدمة {{ index + 1 }}</span>
          <UButton
            size="xs"
            variant="ghost"
            color="red"
            icon="i-lucide-trash-2"
            @click="removeExternalService(index)"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="اسم الخدمة" required>
            <UInput
              :model-value="service.name"
              placeholder="مثال: OpenAI API"
              @update:model-value="updateExternalService(index, 'name', $event)"
            />
          </UFormField>

          <UFormField label="نوع الخدمة" required>
            <USelect
              :model-value="service.type"
              :items="externalServiceTypeOptions"
              @update:model-value="updateExternalService(index, 'type', $event)"
            />
          </UFormField>
        </div>

        <UFormField label="رابط API">
          <UInput
            :model-value="service.apiUrl"
            placeholder="https://api.example.com"
            dir="ltr"
            @update:model-value="updateExternalService(index, 'apiUrl', $event)"
          />
        </UFormField>

        <UFormField label="وصف الاستخدام" required>
          <UTextarea
            :model-value="service.description"
            placeholder="كيف سيستخدم المشروع هذه الخدمة؟"
            :rows="4"
            autoresize
            @update:model-value="updateExternalService(index, 'description', $event)"
          />
        </UFormField>

        <UFormField label="متغيرات البيئة المطلوبة">
          <div class="space-y-2">
            <div v-for="(envVar, varIndex) in service.envVars" :key="varIndex" class="flex gap-2">
              <UInput
                :model-value="envVar"
                placeholder="OPENAI_API_KEY"
                dir="ltr"
                class="flex-1"
                @update:model-value="updateEnvVar(index, varIndex, $event)"
              />
              <UButton
                size="sm"
                variant="ghost"
                color="red"
                icon="i-lucide-x"
                @click="removeEnvVar(index, varIndex)"
              />
            </div>
            <UButton
              size="xs"
              variant="link"
              icon="i-lucide-plus"
              @click="addEnvVar(index)"
            >
              إضافة متغير
            </UButton>
          </div>
        </UFormField>
      </div>
    </div>

    <USeparator v-if="showExternalServices" />

    <!-- MCP Servers Selection -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">MCP Servers</h3>
        <UButton
          size="sm"
          variant="soft"
          icon="i-lucide-wand-2"
          @click="autoSelectMcpServers"
        >
          اختيار تلقائي
        </UButton>
      </div>

      <UAlert
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        title="MCP Servers"
        description="سيتم تضمين هذه الـ MCP Servers في ملف .mcp.json وتعليمات CLAUDE.md للمشروع"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard
          v-for="server in mcpServers"
          :key="server.id"
          :class="[
            'cursor-pointer transition-all',
            isServerSelected(server.id) ? 'ring-2 ring-primary-500' : ''
          ]"
          @click="toggleServer(server.id)"
        >
          <div class="flex items-start gap-3">
            <UCheckbox
              :model-value="isServerSelected(server.id)"
              @click.stop
              @update:model-value="toggleServer(server.id)"
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ server.name }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ server.descriptionAr }}</p>
              <div class="flex flex-wrap gap-1 mt-2">
                <UBadge
                  v-for="tech in server.relatedTechnologies"
                  :key="tech"
                  size="xs"
                  :color="getRelatedTechBadgeColor(tech)"
                  variant="subtle"
                >
                  {{ tech }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <p v-if="state.selectedMcpServers?.length > 0" class="text-sm text-gray-500">
        تم اختيار {{ state.selectedMcpServers.length }} MCP server(s)
      </p>
    </div>
  </div>
</template>
