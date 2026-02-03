import type { WizardState } from '~/types/wizard.types'

export function needsFrontend(state: WizardState) {
  return ['fullstack', 'frontend-only', 'chrome-extension'].includes(state.projectType)
    || state.runtimeTargets?.some(t => ['web', 'mobile', 'desktop'].includes(t))
}

export function needsBackend(state: WizardState) {
  return ['fullstack', 'backend-only'].includes(state.projectType)
}

export function needsDatabase(state: WizardState) {
  return ['fullstack', 'backend-only'].includes(state.projectType)
    && state.techStack?.database !== 'None'
}

export function needsAuth(state: WizardState) {
  return ['fullstack', 'backend-only', 'frontend-only'].includes(state.projectType)
    && state.techStack?.auth !== 'None'
}

export function needsAI(state: WizardState) {
  return state.intelligenceLevel !== 'none'
}

export function needsDesktopSystem(state: WizardState) {
  return state.runtimeTargets?.some(t => ['desktop', 'system'].includes(t))
}

export function needsAPI(state: WizardState) {
  return ['fullstack', 'backend-only', 'library', 'integration'].includes(state.projectType)
    || state.runtimeTargets?.some(t => ['desktop', 'cli', 'system'].includes(t))
}

export function needsPorts(state: WizardState) {
  return state.runtimeTargets?.some(t => t === 'web')
    || ['fullstack', 'backend-only'].includes(state.projectType)
}

export function needsEnvVars(state: WizardState) {
  return needsBackend(state)
    || (state.externalServices?.length > 0)
    || (state.aiConfiguration?.models?.some(m => m.isAPI))
}

export function needsHttpApi(state: WizardState) {
  return needsAPI(state) && state.communicationInterfaces?.includes('http-api')
}

export function isFullyLocal(state: WizardState) {
  return !needsBackend(state)
    && !(state.externalServices?.length > 0)
    && !state.aiConfiguration?.models?.some(m => m.isAPI)
}
