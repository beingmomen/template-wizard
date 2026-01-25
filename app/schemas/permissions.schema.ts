import { z } from 'zod'

const permissionActionSchema = z.enum(['create', 'read', 'update', 'delete', 'manage', 'custom'])

const permissionSchema = z.object({
  id: z.string().min(1, 'معرف الصلاحية مطلوب'),
  name: z.string().min(2, 'اسم الصلاحية مطلوب'),
  resource: z.string().min(1, 'المورد مطلوب'),
  action: permissionActionSchema,
  description: z.string().optional()
})

const roleSchema = z.object({
  id: z.string().min(1, 'معرف الدور مطلوب'),
  name: z.string().min(2, 'اسم الدور مطلوب'),
  description: z.string().optional(),
  permissions: z.array(z.string()),
  inheritsFrom: z.string().optional()
})

const permissionsConfigSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(['role-based', 'action-based', 'resource-based', 'custom']),
  superAdminRole: z.string().optional(),
  defaultRole: z.string().optional()
})

export const permissionsSchema = z.object({
  permissionsConfig: permissionsConfigSchema,
  permissions: z.array(permissionSchema),
  roles: z.array(roleSchema)
}).refine(
  (data) => {
    if (!data.permissionsConfig.enabled) return true
    return true
  },
  { message: 'أضف صلاحية واحدة على الأقل عند تفعيل نظام الصلاحيات' }
)

export type PermissionsData = z.infer<typeof permissionsSchema>

export const permissionTypeOptions = [
  { label: 'Role-based', value: 'role-based', descAr: 'صلاحيات بناءً على الأدوار (admin, user, etc.)' },
  { label: 'Action-based', value: 'action-based', descAr: 'صلاحيات بناءً على الأفعال (create, read, etc.)' },
  { label: 'Resource-based', value: 'resource-based', descAr: 'صلاحيات بناءً على الموارد (users, products, etc.)' },
  { label: 'Custom', value: 'custom', descAr: 'نظام صلاحيات مخصص' }
]

export const permissionActionOptions = [
  { label: 'Create', value: 'create', descAr: 'إنشاء' },
  { label: 'Read', value: 'read', descAr: 'عرض' },
  { label: 'Update', value: 'update', descAr: 'تعديل' },
  { label: 'Delete', value: 'delete', descAr: 'حذف' },
  { label: 'Manage', value: 'manage', descAr: 'إدارة كاملة' },
  { label: 'Custom', value: 'custom', descAr: 'مخصص' }
]
