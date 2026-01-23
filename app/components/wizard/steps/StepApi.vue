<script setup>
import { apiStyleOptions, httpMethodOptions } from '~/schemas/api.schema'

const { state, updateField } = useWizardState()

const emptyEndpoint = {
  method: 'GET',
  path: '/',
  description: '',
  authRequired: false,
  body: '',
  response: ''
}

// Update endpoint field
function updateEndpoint(index, field, value) {
  const newEndpoints = [...state.value.endpoints]
  newEndpoints[index][field] = value
  updateField('endpoints', newEndpoints)
}

// Get badge color for HTTP method
function getMethodColor(method) {
  switch (method) {
    case 'GET': return 'success'
    case 'POST': return 'primary'
    case 'PUT': return 'warning'
    case 'PATCH': return 'warning'
    case 'DELETE': return 'error'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- API Style -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="نوع الـ API" required>
        <URadioGroup
          v-model="state.apiStyle"
          :items="apiStyleOptions"
          class="flex gap-4"
        />
      </UFormField>

      <UFormField label="Route Prefix">
        <UInput
          v-model="state.routePrefix"
          placeholder="/api أو /api/v1"
          dir="ltr"
        />
      </UFormField>
    </div>

    <USeparator />

    <!-- Endpoints -->
    <FormDynamicArrayField
      v-model="state.endpoints"
      label="الـ Endpoints"
      add-label="إضافة Endpoint"
      :empty-item="emptyEndpoint"
      :min-items="0"
    >
      <template #default="{ item: endpoint, index }">
        <div class="space-y-4">
          <!-- Method & Path -->
          <div class="grid grid-cols-3 gap-2">
            <UFormField label="Method">
              <USelect
                :model-value="endpoint.method"
                :items="httpMethodOptions"
                @update:model-value="updateEndpoint(index, 'method', $event)"
              />
            </UFormField>

            <UFormField label="Path" class="col-span-2">
              <UInput
                :model-value="endpoint.path"
                placeholder="/products/:id"
                dir="ltr"
                @update:model-value="updateEndpoint(index, 'path', $event)"
              >
                <template #leading>
                  <UBadge :color="getMethodColor(endpoint.method)" variant="subtle" size="xs">
                    {{ endpoint.method }}
                  </UBadge>
                </template>
              </UInput>
            </UFormField>
          </div>

          <!-- Description -->
          <UFormField label="الوصف" required>
            <UInput
              :model-value="endpoint.description"
              placeholder="وصف ما يفعله هذا الـ endpoint"
              @update:model-value="updateEndpoint(index, 'description', $event)"
            />
          </UFormField>

          <!-- Auth Required -->
          <UFormField>
            <USwitch
              :model-value="endpoint.authRequired"
              label="يتطلب مصادقة"
              @update:model-value="updateEndpoint(index, 'authRequired', $event)"
            />
          </UFormField>
        </div>
      </template>
    </FormDynamicArrayField>

    <!-- Common Endpoints Quick Add -->
    <UCard variant="subtle">
      <template #header>
        <span class="text-sm font-medium">إضافة سريعة - Endpoints شائعة</span>
      </template>
      <div class="flex flex-wrap gap-2">
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'POST', path: '/auth/login', description: 'تسجيل الدخول', authRequired: false, body: '', response: '' })"
        >
          Login
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'POST', path: '/auth/register', description: 'إنشاء حساب', authRequired: false, body: '', response: '' })"
        >
          Register
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'GET', path: '/api/items', description: 'جلب قائمة العناصر', authRequired: true, body: '', response: '' })"
        >
          GET List
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'GET', path: '/api/items/:id', description: 'جلب عنصر واحد', authRequired: true, body: '', response: '' })"
        >
          GET One
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'POST', path: '/api/items', description: 'إنشاء عنصر جديد', authRequired: true, body: '', response: '' })"
        >
          POST
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'PUT', path: '/api/items/:id', description: 'تحديث عنصر', authRequired: true, body: '', response: '' })"
        >
          PUT
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.endpoints.push({ method: 'DELETE', path: '/api/items/:id', description: 'حذف عنصر', authRequired: true, body: '', response: '' })"
        >
          DELETE
        </UButton>
      </div>
    </UCard>
  </div>
</template>
