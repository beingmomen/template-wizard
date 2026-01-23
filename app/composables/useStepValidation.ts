import type { ZodSchema } from 'zod'
import { quickReferenceSchema } from '~/schemas/quickReference.schema'
import { userStoriesSchema } from '~/schemas/userStories.schema'
import { technicalSchema } from '~/schemas/technical.schema'
import { databaseSchema } from '~/schemas/database.schema'
import { apiSchema } from '~/schemas/api.schema'
import { frontendSchema } from '~/schemas/frontend.schema'
import { featuresSchemaSmall, featuresSchemaExtended } from '~/schemas/features.schema'
import { dependenciesSchema } from '~/schemas/dependencies.schema'
import type { WizardState } from '~/types/wizard.types'

export function useStepValidation() {
  const { state, requiresExtendedFeatures } = useWizardState()

  // Get schema for specific step
  const getSchemaForStep = (step: number): ZodSchema | null => {
    switch (step) {
      case 0:
        return quickReferenceSchema
      case 1:
        return userStoriesSchema
      case 2:
        return technicalSchema
      case 3:
        return databaseSchema
      case 4:
        return apiSchema
      case 5:
        return frontendSchema
      case 6:
        return requiresExtendedFeatures.value ? featuresSchemaExtended : featuresSchemaSmall
      case 7:
        return dependenciesSchema
      default:
        return null
    }
  }

  // Get data for specific step from state
  const getDataForStep = (step: number): Partial<WizardState> => {
    switch (step) {
      case 0:
        return {
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
          techStack: state.value.techStack,
          architecture: state.value.architecture,
          multiTenancy: state.value.multiTenancy
        }
      case 3:
        return {
          tables: state.value.tables,
          relationships: state.value.relationships
        }
      case 4:
        return {
          apiStyle: state.value.apiStyle,
          routePrefix: state.value.routePrefix,
          endpoints: state.value.endpoints
        }
      case 5:
        return {
          pages: state.value.pages,
          sharedComponents: state.value.sharedComponents
        }
      case 6:
        return {
          mvpFeatures: state.value.mvpFeatures,
          futureFeatures: state.value.futureFeatures,
          wireframes: state.value.wireframes,
          edgeCases: state.value.edgeCases,
          implementationPhases: state.value.implementationPhases
        }
      case 7:
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

  // Validate specific step
  const validateStep = (step: number): { valid: boolean; errors: string[] } => {
    const schema = getSchemaForStep(step)
    if (!schema) return { valid: true, errors: [] }

    const data = getDataForStep(step)
    const result = schema.safeParse(data)

    if (result.success) {
      return { valid: true, errors: [] }
    }

    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join('.')
      return path ? `${path}: ${issue.message}` : issue.message
    })

    return { valid: false, errors }
  }

  // Validate current step
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
