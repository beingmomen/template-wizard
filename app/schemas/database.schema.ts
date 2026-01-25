import { z } from 'zod'

const foreignKeySchema = z.object({
  relatedTable: z.string().min(1, 'اختر الجدول المرتبط'),
  relationshipType: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
  onDelete: z.enum(['RESTRICT', 'CASCADE', 'SET NULL', 'NO ACTION']).default('RESTRICT')
})

const columnSchema = z.object({
  name: z.string().min(1, 'اسم العمود مطلوب'),
  type: z.enum(['string', 'number', 'boolean', 'date', 'uuid', 'json', 'text', 'decimal']),
  constraints: z.array(z.enum(['primary', 'unique', 'nullable', 'notNull', 'indexed', 'autoIncrement', 'foreignKey', 'default'])),
  foreignKey: foreignKeySchema.optional(),
  defaultValue: z.string().optional()
})

const tableSchema = z.object({
  tableName: z.string().min(1, 'اسم الجدول مطلوب'),
  description: z.string().optional(),
  columns: z.array(columnSchema).min(1, 'أضف عمود واحد على الأقل')
})

export const databaseSchema = z.object({
  tables: z.array(tableSchema).min(1, 'أضف جدول واحد على الأقل'),
  relationships: z.string().optional()
})

export type DatabaseData = z.infer<typeof databaseSchema>

export const columnTypeOptions = [
  { label: 'String (VARCHAR)', value: 'string' },
  { label: 'Number (INT)', value: 'number' },
  { label: 'Decimal', value: 'decimal' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Date/Timestamp', value: 'date' },
  { label: 'UUID', value: 'uuid' },
  { label: 'JSON', value: 'json' },
  { label: 'Text (Long)', value: 'text' }
]

export const constraintOptions = [
  { label: 'Primary Key', value: 'primary' },
  { label: 'Auto Increment', value: 'autoIncrement' },
  { label: 'Unique', value: 'unique' },
  { label: 'Not Null', value: 'notNull' },
  { label: 'Nullable', value: 'nullable' },
  { label: 'Indexed', value: 'indexed' },
  { label: 'Foreign Key', value: 'foreignKey' },
  { label: 'Default Value', value: 'default' }
]

export const relationshipTypeOptions = [
  { label: 'One-to-One (1:1)', value: 'one-to-one' },
  { label: 'One-to-Many (1:N)', value: 'one-to-many' },
  { label: 'Many-to-Many (N:N)', value: 'many-to-many' }
]

export const onDeleteOptions = [
  { label: 'RESTRICT - منع الحذف', value: 'RESTRICT' },
  { label: 'CASCADE - حذف تلقائي', value: 'CASCADE' },
  { label: 'SET NULL - تعيين NULL', value: 'SET NULL' },
  { label: 'NO ACTION - لا إجراء', value: 'NO ACTION' }
]
