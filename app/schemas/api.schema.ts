import { z } from 'zod'

const queryParameterSchema = z.object({
  name: z.string().min(1, 'اسم الـ parameter مطلوب'),
  type: z.enum(['string', 'number', 'boolean', 'array']),
  required: z.boolean(),
  description: z.string().optional(),
  example: z.string().optional()
})

const endpointSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1, 'المسار مطلوب').startsWith('/', 'المسار يجب أن يبدأ بـ /'),
  description: z.string().min(5, 'الوصف مطلوب'),
  authRequired: z.boolean(),
  requiredPermissions: z.array(z.string()).optional(),
  queryParameters: z.array(queryParameterSchema).optional(),
  body: z.string().optional(),
  response: z.string().optional()
})

const apiGroupSchema = z.object({
  name: z.string().min(1, 'اسم المجموعة مطلوب'),
  basePath: z.string().optional(),
  description: z.string().optional(),
  endpoints: z.array(endpointSchema).optional()
})

export const apiSchema = z.object({
  apiStyle: z.enum(['REST', 'GraphQL', 'tRPC']),
  routePrefix: z.string().optional(),
  communicationInterfaces: z.array(z.enum(['http-api', 'local-ipc', 'tauri-commands', 'cli-flags', 'file-based'])).optional(),
  endpoints: z.array(endpointSchema).optional(),
  apiGroups: z.array(apiGroupSchema).optional()
}).refine(
  (data) => {
    const hasLegacyEndpoints = data.endpoints && data.endpoints.length > 0
    const hasGroupEndpoints = data.apiGroups && data.apiGroups.some(g => g.endpoints && g.endpoints.length > 0)
    return hasLegacyEndpoints || hasGroupEndpoints
  },
  { message: 'أضف endpoint واحد على الأقل' }
)

export type ApiData = z.infer<typeof apiSchema>

// Options
export const apiStyleOptions = [
  { label: 'REST API', value: 'REST' },
  { label: 'GraphQL', value: 'GraphQL' },
  { label: 'tRPC', value: 'tRPC' }
]

export const httpMethodOptions = [
  { label: 'GET', value: 'GET', color: 'success' },
  { label: 'POST', value: 'POST', color: 'primary' },
  { label: 'PUT', value: 'PUT', color: 'warning' },
  { label: 'PATCH', value: 'PATCH', color: 'warning' },
  { label: 'DELETE', value: 'DELETE', color: 'error' }
]

export const queryParamTypeOptions = [
  { label: 'String (نص)', value: 'string' },
  { label: 'Number (رقم)', value: 'number' },
  { label: 'Boolean (منطقي)', value: 'boolean' },
  { label: 'Array (مصفوفة)', value: 'array' }
]

export const commonQueryParams = {
  pagination: [
    { name: 'limit', type: 'number', required: false, description: 'عدد العناصر', example: '10' },
    { name: 'offset', type: 'number', required: false, description: 'بداية العناصر', example: '0' },
    { name: 'page', type: 'number', required: false, description: 'رقم الصفحة', example: '1' }
  ],
  search: [
    { name: 'search', type: 'string', required: false, description: 'كلمة البحث', example: '' },
    { name: 'q', type: 'string', required: false, description: 'استعلام البحث', example: '' }
  ],
  sorting: [
    { name: 'sort', type: 'string', required: false, description: 'حقل الترتيب', example: 'created_at' },
    { name: 'order', type: 'string', required: false, description: 'اتجاه الترتيب (asc/desc)', example: 'desc' }
  ],
  filtering: [
    { name: 'filter', type: 'string', required: false, description: 'فلتر البيانات', example: '' },
    { name: 'status', type: 'string', required: false, description: 'حالة العنصر', example: 'active' }
  ]
}
