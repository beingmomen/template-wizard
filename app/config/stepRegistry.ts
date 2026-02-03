import type { WizardState } from '~/types/wizard.types'

import type { ZodSchema } from 'zod'
import type { Component } from 'vue'

interface StepRegistryEntry {
  component: () => Promise<{ default: Component }>
  schema?: (state: WizardState) => Promise<ZodSchema | null>
  dataExtractor: (state: WizardState) => Partial<WizardState>
}

const STEP_REGISTRY: Record<number, StepRegistryEntry> = {
  0: {
    component: () => import('~/components/wizard/steps/StepQuickReference.vue'),
    schema: () => import('~/schemas/quickReference.schema').then(m => m.quickReferenceSchema),
    dataExtractor: state => ({
      projectType: state.projectType,
      projectNature: state.projectNature,
      runtimeTargets: state.runtimeTargets,
      intelligenceLevel: state.intelligenceLevel,
      projectSize: state.projectSize,
      projectName: state.projectName,
      projectNameTechnical: state.projectNameTechnical,
      problemStatement: state.problemStatement,
      solutionDescription: state.solutionDescription,
      targetUsers: state.targetUsers,
      targetUserType: state.targetUserType,
      targetUserLevel: state.targetUserLevel,
      primaryLanguage: state.primaryLanguage
    })
  },
  1: {
    component: () => import('~/components/wizard/steps/StepUserStories.vue'),
    schema: () => import('~/schemas/userStories.schema').then(m => m.userStoriesSchema),
    dataExtractor: state => ({
      userTypes: state.userTypes
    })
  },
  2: {
    component: () => import('~/components/wizard/steps/StepPermissions.vue'),
    schema: () => import('~/schemas/permissions.schema').then(m => m.permissionsSchema),
    dataExtractor: state => ({
      permissionsConfig: state.permissionsConfig,
      permissions: state.permissions,
      roles: state.roles
    })
  },
  3: {
    component: () => import('~/components/wizard/steps/StepTechnical.vue'),
    schema: state => import('~/schemas/technical.schema').then(m => m.createTechnicalSchema(state.projectType)),
    dataExtractor: state => ({
      techStack: state.techStack,
      architecture: state.architecture,
      multiTenancy: state.multiTenancy,
      externalServices: state.externalServices
    })
  },
  4: {
    component: () => import('~/components/wizard/steps/StepSummary.vue'),
    dataExtractor: () => ({})
  },
  5: {
    component: () => import('~/components/wizard/steps/StepDatabase.vue'),
    schema: () => import('~/schemas/database.schema').then(m => m.databaseSchema),
    dataExtractor: state => ({
      tables: state.tables,
      relationships: state.relationships
    })
  },
  6: {
    component: () => import('~/components/wizard/steps/StepSummaryWithDB.vue'),
    dataExtractor: () => ({})
  },
  7: {
    component: () => import('~/components/wizard/steps/StepApi.vue'),
    schema: () => import('~/schemas/api.schema').then(m => m.apiSchema),
    dataExtractor: state => ({
      apiStyle: state.apiStyle,
      routePrefix: state.routePrefix,
      communicationInterfaces: state.communicationInterfaces,
      endpoints: state.endpoints,
      apiGroups: state.apiGroups
    })
  },
  8: {
    component: () => import('~/components/wizard/steps/StepFrontend.vue'),
    schema: () => import('~/schemas/frontend.schema').then(m => m.frontendSchema),
    dataExtractor: state => ({
      frontendMode: state.frontendMode,
      selectedTemplate: state.selectedTemplate,
      pages: state.pages,
      frontendModules: state.frontendModules,
      sharedComponents: state.sharedComponents
    })
  },
  9: {
    component: () => import('~/components/wizard/steps/StepFeatures.vue'),
    schema: (state) => {
      const requiresExtended = ['fullstack', 'backend-only', 'cli-tool', 'integration'].includes(state.projectType)
      return import('~/schemas/features.schema').then(m =>
        requiresExtended ? m.featuresSchemaExtended : m.featuresSchemaSmall
      )
    },
    dataExtractor: state => ({
      mvpFeatures: state.mvpFeatures,
      futureFeatures: state.futureFeatures,
      wireframes: state.wireframes,
      edgeCases: state.edgeCases,
      implementationPhases: state.implementationPhases
    })
  },
  10: {
    component: () => import('~/components/wizard/steps/StepDependencies.vue'),
    schema: state => import('~/schemas/dependencies.schema').then(m => m.createDependenciesSchema(state)),
    dataExtractor: state => ({
      backendDependencies: state.backendDependencies,
      frontendDependencies: state.frontendDependencies,
      aiDependencies: state.aiDependencies,
      systemDependencies: state.systemDependencies,
      buildDependencies: state.buildDependencies,
      environmentVariables: state.environmentVariables,
      seedData: state.seedData
    })
  },
  11: {
    component: () => import('~/components/wizard/steps/StepGuidelines.vue'),
    dataExtractor: () => ({})
  },
  12: {
    component: () => import('~/components/wizard/steps/StepAIConfiguration.vue'),
    schema: () => import('~/schemas/aiConfiguration.schema').then(m => m.aiConfigurationSchema),
    dataExtractor: state => ({
      aiConfiguration: state.aiConfiguration
    })
  },
  13: {
    component: () => import('~/components/wizard/steps/StepDesktopSystem.vue'),
    schema: () => import('~/schemas/desktopSystem.schema').then(m => m.desktopSystemSchema),
    dataExtractor: state => ({
      desktopSystemCapabilities: state.desktopSystemCapabilities
    })
  }
}

export function getStepComponent(stepId: number) {
  return STEP_REGISTRY[stepId]?.component || null
}

export async function getStepSchema(stepId: number, state: WizardState) {
  const entry = STEP_REGISTRY[stepId]
  if (!entry?.schema) return null
  return await entry.schema(state)
}

export function getStepData(stepId: number, state: WizardState): Partial<WizardState> {
  const entry = STEP_REGISTRY[stepId]
  if (!entry?.dataExtractor) return {}
  return entry.dataExtractor(state)
}
