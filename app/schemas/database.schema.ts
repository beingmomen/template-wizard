import { z } from 'zod'

const columnSchema = z.object({
  name: z.string().min(1, 'اسم العمود مطلوب'),
  type: z.enum(['string', 'number', 'boolean', 'date', 'uuid', 'json', 'text', 'decimal']),
  constraints: z.array(z.enum(['primary', 'unique', 'nullable', 'indexed'])),
  references: z.string().optional()
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

// Options
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
  { label: 'Unique', value: 'unique' },
  { label: 'Nullable', value: 'nullable' },
  { label: 'Indexed', value: 'indexed' }
]
