<script setup>
import { columnTypeOptions, constraintOptions } from '~/schemas/database.schema'

const { state, updateField } = useWizardState()

const emptyColumn = {
  name: '',
  type: 'string',
  constraints: [],
  references: ''
}

const emptyTable = {
  tableName: '',
  description: '',
  columns: [{ ...emptyColumn }]
}

// Update table name
function updateTableName(index, name) {
  const newTables = [...state.value.tables]
  newTables[index].tableName = name
  updateField('tables', newTables)
}

// Update table description
function updateTableDescription(index, desc) {
  const newTables = [...state.value.tables]
  newTables[index].description = desc
  updateField('tables', newTables)
}

// Add column to table
function addColumn(tableIndex) {
  const newTables = [...state.value.tables]
  newTables[tableIndex].columns.push({ ...emptyColumn })
  updateField('tables', newTables)
}

// Remove column from table
function removeColumn(tableIndex, columnIndex) {
  if (state.value.tables[tableIndex].columns.length > 1) {
    const newTables = [...state.value.tables]
    newTables[tableIndex].columns.splice(columnIndex, 1)
    updateField('tables', newTables)
  }
}

// Update column
function updateColumn(tableIndex, columnIndex, field, value) {
  const newTables = [...state.value.tables]
  newTables[tableIndex].columns[columnIndex][field] = value
  updateField('tables', newTables)
}
</script>

<template>
  <div class="space-y-6">
    <FormDynamicArrayField
      v-model="state.tables"
      label="جداول قاعدة البيانات"
      add-label="إضافة جدول"
      :empty-item="emptyTable"
    >
      <template #default="{ item: table, index: tableIndex }">
        <div class="space-y-4">
          <!-- Table Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="اسم الجدول" required>
              <UInput
                :model-value="table.tableName"
                placeholder="مثال: users, products"
                dir="ltr"
                @update:model-value="updateTableName(tableIndex, $event)"
              />
            </UFormField>

            <UFormField label="وصف الجدول">
              <UInput
                :model-value="table.description"
                placeholder="مثال: جدول المستخدمين"
                @update:model-value="updateTableDescription(tableIndex, $event)"
              />
            </UFormField>
          </div>

          <!-- Columns -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">
                الأعمدة
              </label>
              <UButton
                size="xs"
                variant="soft"
                icon="i-lucide-plus"
                label="إضافة عمود"
                @click="addColumn(tableIndex)"
              />
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-right bg-gray-100 dark:bg-gray-700">
                    <th class="p-2">الاسم</th>
                    <th class="p-2">النوع</th>
                    <th class="p-2">القيود</th>
                    <th class="p-2">المرجع</th>
                    <th class="p-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(col, colIndex) in table.columns"
                    :key="colIndex"
                    class="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td class="p-2">
                      <UInput
                        :model-value="col.name"
                        placeholder="name"
                        size="sm"
                        dir="ltr"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'name', $event)"
                      />
                    </td>
                    <td class="p-2">
                      <USelect
                        :model-value="col.type"
                        :items="columnTypeOptions"
                        size="sm"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'type', $event)"
                      />
                    </td>
                    <td class="p-2">
                      <USelectMenu
                        :model-value="col.constraints"
                        :items="constraintOptions"
                        multiple
                        size="sm"
                        placeholder="اختر"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'constraints', $event)"
                      />
                    </td>
                    <td class="p-2">
                      <UInput
                        :model-value="col.references"
                        placeholder="table.column"
                        size="sm"
                        dir="ltr"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'references', $event)"
                      />
                    </td>
                    <td class="p-2">
                      <UButton
                        v-if="table.columns.length > 1"
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-lucide-x"
                        @click="removeColumn(tableIndex, colIndex)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </FormDynamicArrayField>

    <!-- Relationships -->
    <UFormField label="العلاقات بين الجداول" name="relationships">
      <UTextarea
        v-model="state.relationships"
        placeholder="مثال:
- users → orders: One-to-Many (مستخدم له عدة طلبات)
- orders → order_items: One-to-Many (طلب له عدة عناصر)"
        :rows="4"
      />
    </UFormField>
  </div>
</template>
