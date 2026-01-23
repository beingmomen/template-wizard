import { z } from 'zod'

const endpointSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1, 'المسار مطلوب').startsWith('/', 'المسار يجب أن يبدأ بـ /'),
  description: z.string().min(5, 'الوصف مطلوب'),
  authRequired: z.boolean(),
  body: z.string().optional(),
  response: z.string().optional()
})

export const apiSchema = z.object({
  apiStyle: z.enum(['REST', 'GraphQL', 'tRPC']),
  routePrefix: z.string().optional(),
  endpoints: z.array(endpointSchema).min(1, 'أضف endpoint واحد على الأقل')
})

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
