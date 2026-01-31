import { getStepSchema, getStepData } from '~/config/stepRegistry'

const fieldTranslations: Record<string, string> = {
  apiGroups: 'مجموعة API',
  endpoints: 'Endpoint',
  tables: 'جدول',
  columns: 'عمود',
  frontendModules: 'Module',
  pages: 'صفحة',
  userTypes: 'نوع المستخدم',
  stories: 'قصة',
  permissions: 'صلاحية',
  roles: 'دور',
  externalServices: 'خدمة خارجية',
  environmentVariables: 'متغير بيئة',
  mvpFeatures: 'ميزة MVP',
  futureFeatures: 'ميزة مستقبلية',
  edgeCases: 'حالة حدية',
  implementationPhases: 'مرحلة',
  queryParameters: 'Query Parameter',
  name: 'الاسم',
  description: 'الوصف',
  path: 'المسار',
  method: 'الطريقة',
  tableName: 'اسم الجدول',
  basePath: 'المسار الأساسي',
  userType: 'نوع المستخدم',
  story: 'القصة',
  type: 'النوع',
  constraints: 'القيود',
  authRequired: 'المصادقة',
  requiredPermissions: 'الصلاحيات المطلوبة',
  projectName: 'اسم المشروع',
  projectNameTechnical: 'الاسم التقني',
  problemStatement: 'وصف المشكلة',
  solutionDescription: 'وصف الحل',
  targetUsers: 'المستخدمين المستهدفين',
  runtimeTargets: 'بيئات التشغيل',
  projectNature: 'طبيعة المشروع',
  intelligenceLevel: 'مستوى الذكاء',
  communicationInterfaces: 'واجهات التواصل',
  aiConfiguration: 'إعدادات الذكاء الاصطناعي',
  domains: 'المجالات',
  models: 'النماذج',
  hardwarePreference: 'تفضيل العتاد',
  desktopSystemCapabilities: 'إمكانيات النظام',
  aiDependencies: 'مكتبات الذكاء الاصطناعي',
  systemDependencies: 'مكتبات النظام',
  buildDependencies: 'مكتبات البناء'
}

function formatErrorPath(path: Array<string | number>): string {
  if (path.length === 0) return ''

  const parts: string[] = []
  for (let i = 0; i < path.length; i++) {
    const segment = path[i] as string | number
    if (typeof segment === 'number') {
      parts.push(`رقم ${segment + 1}`)
    } else {
      const translation = fieldTranslations[segment]
      if (translation) {
        parts.push(translation)
      } else {
        parts.push(segment)
      }
    }
  }
  return parts.join(' > ')
}

export function useStepValidation() {
  const { state, visibleSteps } = useWizardState()

  const validateStep = async (visibleIndex: number): Promise<{ valid: boolean, errors: string[] }> => {
    const step = visibleSteps.value[visibleIndex]
    if (!step) return { valid: true, errors: [] }

    const stepId = step.id
    const schema = await getStepSchema(stepId, state.value)
    if (!schema) return { valid: true, errors: [] }

    const data = getStepData(stepId, state.value)
    const result = schema.safeParse(data)

    if (result.success) {
      return { valid: true, errors: [] }
    }

    const errors = result.error.issues.map((issue: { path: Array<string | number>, message: string }) => {
      const formattedPath = formatErrorPath(issue.path)
      return formattedPath ? `${formattedPath}: ${issue.message}` : issue.message
    })

    return { valid: false, errors }
  }

  const validateCurrentStep = async (): Promise<{ valid: boolean, errors: string[] }> => {
    const { currentStep } = useWizardState()
    return validateStep(currentStep.value)
  }

  return {
    validateStep,
    validateCurrentStep
  }
}
