import type { ZodSchema } from 'zod'
import { quickReferenceSchema } from '~/schemas/quickReference.schema'
import { userStoriesSchema } from '~/schemas/userStories.schema'
import { permissionsSchema } from '~/schemas/permissions.schema'
import { createTechnicalSchema, technicalSchema } from '~/schemas/technical.schema'
import { databaseSchema } from '~/schemas/database.schema'
import { apiSchema } from '~/schemas/api.schema'
import { frontendSchema } from '~/schemas/frontend.schema'
import { featuresSchemaSmall, featuresSchemaExtended } from '~/schemas/features.schema'
import { dependenciesSchema } from '~/schemas/dependencies.schema'
import type { WizardState } from '~/types/wizard.types'

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
  targetUsers: 'المستخدمين المستهدفين'
}

function formatErrorPath(path: (string | number)[]): string {
  if (path.length === 0) return ''

  const parts: string[] = []
  for (let i = 0; i < path.length; i++) {
    const segment = path[i]
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
  const { state, requiresExtendedFeatures, currentStepInfo, visibleSteps } = useWizardState()

  const getSchemaForStep = (stepId: number): ZodSchema | null => {
    const projectType = state.value.projectType || 'fullstack'

    switch (stepId) {
      case 0:
        return quickReferenceSchema
      case 1:
        return userStoriesSchema
      case 2:
        return permissionsSchema
      case 3:
        return createTechnicalSchema(projectType)
      case 4:
        return null
      case 5:
        return databaseSchema
      case 6:
        return null
      case 7:
        return apiSchema
      case 8:
        return frontendSchema
      case 9:
        return requiresExtendedFeatures.value ? featuresSchemaExtended : featuresSchemaSmall
      case 10:
        return dependenciesSchema
      default:
        return null
    }
  }

  const getDataForStep = (stepId: number): Partial<WizardState> => {
    switch (stepId) {
      case 0:
        return {
          projectType: state.value.projectType,
          projectSize: state.value.projectSize,
          projectName: state.value.projectName,
          projectNameTechnical: state.value.projectNameTechnical,
          problemStatement: state.value.problemStatement,
          solutionDescription: state.value.solutionDescription,
          targetUsers: state.value.targetUsers,
          targetUserType: state.value.targetUserType,
          targetUserLevel: state.value.targetUserLevel,
          primaryLanguage: state.value.primaryLanguage
        }
      case 1:
        return {
          userTypes: state.value.userTypes
        }
      case 2:
        return {
          permissionsConfig: state.value.permissionsConfig,
          permissions: state.value.permissions,
          roles: state.value.roles
        }
      case 3:
        return {
          techStack: state.value.techStack,
          architecture: state.value.architecture,
          multiTenancy: state.value.multiTenancy,
          externalServices: state.value.externalServices
        }
      case 4:
        return {}
      case 5:
        return {
          tables: state.value.tables,
          relationships: state.value.relationships
        }
      case 6:
        return {}
      case 7:
        return {
          apiStyle: state.value.apiStyle,
          routePrefix: state.value.routePrefix,
          endpoints: state.value.endpoints,
          apiGroups: state.value.apiGroups
        }
      case 8:
        return {
          frontendMode: state.value.frontendMode,
          selectedTemplate: state.value.selectedTemplate,
          pages: state.value.pages,
          frontendModules: state.value.frontendModules,
          sharedComponents: state.value.sharedComponents
        }
      case 9:
        return {
          mvpFeatures: state.value.mvpFeatures,
          futureFeatures: state.value.futureFeatures,
          wireframes: state.value.wireframes,
          edgeCases: state.value.edgeCases,
          implementationPhases: state.value.implementationPhases
        }
      case 10:
        return {
          backendDependencies: state.value.backendDependencies,
          frontendDependencies: state.value.frontendDependencies,
          environmentVariables: state.value.environmentVariables,
          seedData: state.value.seedData
        }
      default:
        return {}
    }
  }

  const validateStep = (visibleIndex: number): { valid: boolean; errors: string[] } => {
    const step = visibleSteps.value[visibleIndex]
    if (!step) return { valid: true, errors: [] }

    const stepId = step.id
    const schema = getSchemaForStep(stepId)
    if (!schema) return { valid: true, errors: [] }

    const data = getDataForStep(stepId)
    const result = schema.safeParse(data)

    if (result.success) {
      return { valid: true, errors: [] }
    }

    const errors = result.error.issues.map((issue) => {
      const formattedPath = formatErrorPath(issue.path)
      return formattedPath ? `${formattedPath}: ${issue.message}` : issue.message
    })

    return { valid: false, errors }
  }

  const validateCurrentStep = (): { valid: boolean; errors: string[] } => {
    const { currentStep } = useWizardState()
    return validateStep(currentStep.value)
  }

  return {
    getSchemaForStep,
    validateStep,
    validateCurrentStep
  }
}
