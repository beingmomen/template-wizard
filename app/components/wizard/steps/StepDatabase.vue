<script setup>
import { columnTypeOptions, constraintOptions, relationshipTypeOptions, onDeleteOptions } from '~/schemas/database.schema'

const { state, updateField } = useWizardState()

const labelToValueMap = {
  'Primary Key': 'primary',
  'Auto Increment': 'autoIncrement',
  'Unique': 'unique',
  'Not Null': 'notNull',
  'Nullable': 'nullable',
  'Indexed': 'indexed',
  'Foreign Key': 'foreignKey',
  'Default Value': 'default'
}

const validConstraintValues = new Set(['primary', 'unique', 'nullable', 'notNull', 'indexed', 'autoIncrement', 'foreignKey', 'default'])

function migrateOldConstraintValues() {
  let needsUpdate = false
  const newTables = state.value.tables.map(table => ({
    ...table,
    columns: table.columns.map(col => {
      if (!col.constraints || col.constraints.length === 0) return col

      const migratedConstraints = col.constraints
        .map(c => labelToValueMap[c] || c)
        .filter(c => validConstraintValues.has(c))

      const uniqueConstraints = [...new Set(migratedConstraints)]

      if (JSON.stringify(col.constraints) !== JSON.stringify(uniqueConstraints)) {
        needsUpdate = true
      }

      return { ...col, constraints: uniqueConstraints }
    })
  }))

  if (needsUpdate) {
    updateField('tables', newTables)
  }
}

onMounted(() => {
  migrateOldConstraintValues()
})

const emptyColumn = {
  name: '',
  type: 'string',
  constraints: []
}

const defaultColumns = [
  {
    name: 'id',
    type: 'number',
    constraints: ['primary', 'autoIncrement']
  },
  {
    name: 'created_at',
    type: 'date',
    constraints: ['default'],
    defaultValue: 'CURRENT_TIMESTAMP'
  },
  {
    name: 'updated_at',
    type: 'date',
    constraints: ['default'],
    defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
]

const emptyTable = {
  tableName: '',
  description: '',
  columns: defaultColumns.map(col => ({ ...col }))
}

function getAvailableTablesForFK(currentTableIndex) {
  return state.value.tables
    .filter((t, idx) => t.tableName && idx !== currentTableIndex)
    .map(t => ({ label: t.tableName, value: t.tableName }))
}

function updateTableName(index, name) {
  const newTables = [...state.value.tables]
  newTables[index].tableName = name
  updateField('tables', newTables)
}

function updateTableDescription(index, desc) {
  const newTables = [...state.value.tables]
  newTables[index].description = desc
  updateField('tables', newTables)
}

function addColumn(tableIndex) {
  const newTables = [...state.value.tables]
  newTables[tableIndex].columns.push({ ...emptyColumn })
  updateField('tables', newTables)
}

function removeColumn(tableIndex, columnIndex) {
  if (state.value.tables[tableIndex].columns.length > 1) {
    const newTables = [...state.value.tables]
    newTables[tableIndex].columns.splice(columnIndex, 1)
    updateField('tables', newTables)
  }
}

function updateColumn(tableIndex, columnIndex, field, value) {
  const newTables = [...state.value.tables]
  newTables[tableIndex].columns[columnIndex][field] = value

  if (field === 'constraints') {
    const hasFk = value.includes('foreignKey')
    if (hasFk && !newTables[tableIndex].columns[columnIndex].foreignKey) {
      newTables[tableIndex].columns[columnIndex].foreignKey = {
        relatedTable: '',
        relationshipType: 'one-to-many',
        onDelete: 'RESTRICT'
      }
    } else if (!hasFk) {
      delete newTables[tableIndex].columns[columnIndex].foreignKey
    }
  }

  updateField('tables', newTables)
}

function updateForeignKey(tableIndex, columnIndex, field, value) {
  const newTables = [...state.value.tables]
  if (!newTables[tableIndex].columns[columnIndex].foreignKey) {
    newTables[tableIndex].columns[columnIndex].foreignKey = {
      relatedTable: '',
      relationshipType: 'one-to-many',
      onDelete: 'RESTRICT'
    }
  }
  newTables[tableIndex].columns[columnIndex].foreignKey[field] = value
  updateField('tables', newTables)
}

function hasForeignKey(column) {
  return column.constraints?.includes('foreignKey')
}

function hasDefaultConstraint(column) {
  return column.constraints?.includes('default')
}

const detectedRelationships = computed(() => {
  const relationships = []
  state.value.tables.forEach((table) => {
    table.columns.forEach((col) => {
      if (col.foreignKey?.relatedTable) {
        const typeLabels = {
          'one-to-one': '1:1',
          'one-to-many': '1:N',
          'many-to-many': 'N:N'
        }
        relationships.push({
          from: `${table.tableName}.${col.name}`,
          to: `${col.foreignKey.relatedTable}.id`,
          type: typeLabels[col.foreignKey.relationshipType] || col.foreignKey.relationshipType,
          onDelete: col.foreignKey.onDelete || 'RESTRICT'
        })
      }
    })
  })
  return relationships
})

function getTableName(table) {
  return table.tableName || 'جدول بدون اسم'
}

const columnDeleteConfirm = ref({
  show: false,
  tableIndex: -1,
  columnIndex: -1,
  name: ''
})

const tableDeleteConfirm = ref({
  show: false,
  index: -1,
  name: ''
})

const openTables = ref({})

function toggleTable(index) {
  openTables.value[index] = !isTableOpen(index)
}

function isTableOpen(index) {
  return openTables.value[index] === true
}

function confirmDeleteColumn(tableIndex, columnIndex) {
  const colName = state.value.tables[tableIndex]?.columns[columnIndex]?.name || 'عمود بدون اسم'
  columnDeleteConfirm.value = {
    show: true,
    tableIndex,
    columnIndex,
    name: colName
  }
}

function executeColumnDelete() {
  removeColumn(columnDeleteConfirm.value.tableIndex, columnDeleteConfirm.value.columnIndex)
  columnDeleteConfirm.value.show = false
}

function confirmDeleteTable(index) {
  const tableName = state.value.tables[index]?.tableName || 'جدول بدون اسم'
  tableDeleteConfirm.value = {
    show: true,
    index,
    name: tableName
  }
}

function executeTableDelete() {
  const newTables = state.value.tables.filter((_, i) => i !== tableDeleteConfirm.value.index)
  updateField('tables', newTables)
  tableDeleteConfirm.value.show = false
}
</script>

<template>
  <div class="space-y-6">
    <FormDynamicArrayField
      v-model="state.tables"
      label="جداول قاعدة البيانات"
      add-label="إضافة جدول"
      :empty-item="emptyTable"
      :get-item-name="getTableName"
      item-label="الجدول"
      hide-delete-button
    >
      <template #default="{ item: table, index: tableIndex }">
        <div class="space-y-4 w-full">
          <div
            class="flex items-center justify-between cursor-pointer p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="toggleTable(tableIndex)"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-database" class="w-5 h-5 text-primary-500" />
              <span class="font-medium text-gray-900 dark:text-white">{{ table.tableName || 'جدول جديد' }}</span>
              <UBadge size="xs" variant="subtle">{{ table.columns?.length || 0 }} أعمدة</UBadge>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                :name="isTableOpen(tableIndex) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="w-4 h-4 text-gray-500 transition-transform"
              />
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click.stop="confirmDeleteTable(tableIndex)"
              />
            </div>
          </div>

          <div v-show="isTableOpen(tableIndex)" class="space-y-4 pt-2">
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

            <div class="space-y-3">
              <div
                v-for="(col, colIndex) in table.columns"
                :key="colIndex"
                class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <UFormField label="اسم العمود" required>
                      <UInput
                        :model-value="col.name"
                        placeholder="name"
                        size="sm"
                        dir="ltr"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'name', $event)"
                      />
                    </UFormField>

                    <UFormField label="النوع">
                      <USelect
                        :model-value="col.type"
                        :items="columnTypeOptions"
                        size="sm"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'type', $event)"
                      />
                    </UFormField>

                    <UFormField label="القيود">
                      <USelectMenu
                        :model-value="col.constraints"
                        :items="constraintOptions"
                        value-key="value"
                        multiple
                        size="sm"
                        placeholder="اختر القيود"
                        @update:model-value="updateColumn(tableIndex, colIndex, 'constraints', $event)"
                      />
                    </UFormField>
                  </div>

                  <UButton
                    v-if="table.columns.length > 1"
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    class="mt-6"
                    @click="confirmDeleteColumn(tableIndex, colIndex)"
                  />
                </div>

                <div
                  v-if="hasForeignKey(col)"
                  class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
                >
                  <div class="text-xs font-medium text-primary-700 dark:text-primary-300 mb-2">
                    إعدادات Foreign Key
                  </div>
                  <UAlert
                    v-if="getAvailableTablesForFK(tableIndex).length === 0"
                    icon="i-lucide-info"
                    color="warning"
                    variant="subtle"
                    class="mb-3"
                    title="أضف جداول أخرى أولاً لربطها بهذا العمود"
                  />
                  <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <UFormField label="الجدول المرتبط" required>
                      <USelect
                        :model-value="col.foreignKey?.relatedTable"
                        :items="getAvailableTablesForFK(tableIndex)"
                        size="sm"
                        placeholder="اختر الجدول"
                        @update:model-value="updateForeignKey(tableIndex, colIndex, 'relatedTable', $event)"
                      />
                    </UFormField>

                    <UFormField label="نوع العلاقة">
                      <USelect
                        :model-value="col.foreignKey?.relationshipType || 'one-to-many'"
                        :items="relationshipTypeOptions"
                        size="sm"
                        @update:model-value="updateForeignKey(tableIndex, colIndex, 'relationshipType', $event)"
                      />
                    </UFormField>

                    <UFormField label="عند الحذف (ON DELETE)">
                      <USelect
                        :model-value="col.foreignKey?.onDelete || 'RESTRICT'"
                        :items="onDeleteOptions"
                        size="sm"
                        @update:model-value="updateForeignKey(tableIndex, colIndex, 'onDelete', $event)"
                      />
                    </UFormField>
                  </div>
                </div>

                <div
                  v-if="hasDefaultConstraint(col)"
                  class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <UFormField label="القيمة الافتراضية">
                    <UInput
                      :model-value="col.defaultValue"
                      placeholder="مثال: 0, 'active', NOW(), CURRENT_TIMESTAMP"
                      size="sm"
                      dir="ltr"
                      @update:model-value="updateColumn(tableIndex, colIndex, 'defaultValue', $event)"
                    />
                  </UFormField>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </template>
    </FormDynamicArrayField>

    <div v-if="detectedRelationships.length > 0" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        العلاقات المكتشفة
      </h4>
      <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400" dir="ltr">
        <li v-for="(rel, idx) in detectedRelationships" :key="idx" class="flex items-center gap-2">
          <UIcon name="i-lucide-link" class="w-4 h-4 text-primary-500" />
          <code>{{ rel.from }}</code>
          <span>→</span>
          <code>{{ rel.to }}</code>
          <UBadge size="xs" variant="subtle">{{ rel.type }}</UBadge>
          <UBadge size="xs" variant="subtle" color="warning">{{ rel.onDelete }}</UBadge>
        </li>
      </ul>
    </div>

    <!-- Column Delete Confirmation Modal -->
    <UModal :open="columnDeleteConfirm.show" @update:open="columnDeleteConfirm.show = $event">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تأكيد حذف العمود</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من حذف العمود
            <strong class="text-gray-900 dark:text-white">"{{ columnDeleteConfirm.name }}"</strong>؟
          </p>
          <div class="flex justify-end gap-3 mt-6">
            <UButton variant="ghost" label="إلغاء" @click="columnDeleteConfirm.show = false" />
            <UButton color="error" icon="i-lucide-trash-2" label="حذف" @click="executeColumnDelete" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Table Delete Confirmation Modal -->
    <UModal :open="tableDeleteConfirm.show" @update:open="tableDeleteConfirm.show = $event">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تأكيد حذف الجدول</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            هل أنت متأكد من حذف الجدول
            <strong class="text-gray-900 dark:text-white">"{{ tableDeleteConfirm.name }}"</strong>؟
          </p>
          <div class="flex justify-end gap-3 mt-6">
            <UButton variant="ghost" label="إلغاء" @click="tableDeleteConfirm.show = false" />
            <UButton color="error" icon="i-lucide-trash-2" label="حذف" @click="executeTableDelete" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
