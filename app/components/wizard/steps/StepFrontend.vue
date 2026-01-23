<script setup>
const { state, updateField } = useWizardState()

const emptyPage = {
  path: '/',
  name: '',
  description: '',
  auth: false
}

// Update page field
function updatePage(index, field, value) {
  const newPages = [...state.value.pages]
  newPages[index][field] = value
  updateField('pages', newPages)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Pages -->
    <FormDynamicArrayField
      v-model="state.pages"
      label="صفحات التطبيق"
      add-label="إضافة صفحة"
      :empty-item="emptyPage"
      :min-items="0"
    >
      <template #default="{ item: page, index }">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="المسار (Path)" required>
              <UInput
                :model-value="page.path"
                placeholder="/products"
                dir="ltr"
                @update:model-value="updatePage(index, 'path', $event)"
              />
            </UFormField>

            <UFormField label="اسم الصفحة" required>
              <UInput
                :model-value="page.name"
                placeholder="صفحة المنتجات"
                @update:model-value="updatePage(index, 'name', $event)"
              />
            </UFormField>
          </div>

          <UFormField label="وصف الصفحة" required>
            <UInput
              :model-value="page.description"
              placeholder="عرض قائمة المنتجات مع البحث والفلترة"
              @update:model-value="updatePage(index, 'description', $event)"
            />
          </UFormField>

          <UFormField>
            <USwitch
              :model-value="page.auth"
              label="تتطلب تسجيل دخول"
              @update:model-value="updatePage(index, 'auth', $event)"
            />
          </UFormField>
        </div>
      </template>
    </FormDynamicArrayField>

    <!-- Quick Add Common Pages -->
    <UCard variant="subtle">
      <template #header>
        <span class="text-sm font-medium">إضافة سريعة - صفحات شائعة</span>
      </template>
      <div class="flex flex-wrap gap-2">
        <UButton
          size="xs"
          variant="soft"
          @click="state.pages.push({ path: '/login', name: 'تسجيل الدخول', description: 'صفحة تسجيل الدخول', auth: false })"
        >
          Login
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.pages.push({ path: '/register', name: 'إنشاء حساب', description: 'صفحة إنشاء حساب جديد', auth: false })"
        >
          Register
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.pages.push({ path: '/', name: 'الرئيسية', description: 'لوحة التحكم الرئيسية', auth: true })"
        >
          Dashboard
        </UButton>
        <UButton
          size="xs"
          variant="soft"
          @click="state.pages.push({ path: '/settings', name: 'الإعدادات', description: 'إعدادات الحساب والتطبيق', auth: true })"
        >
          Settings
        </UButton>
      </div>
    </UCard>

    <USeparator />

    <!-- Shared Components -->
    <UFormField label="المكونات المشتركة" name="sharedComponents">
      <UTextarea
        v-model="state.sharedComponents"
        placeholder="اكتب المكونات المشتركة، مثال:
- AppHeader: الهيدر الرئيسي مع القائمة
- AppSidebar: القائمة الجانبية
- DataTable: جدول بيانات مع pagination
- ConfirmDialog: نافذة تأكيد الحذف
- EmptyState: حالة عدم وجود بيانات"
        :rows="6"
      />
    </UFormField>
  </div>
</template>
