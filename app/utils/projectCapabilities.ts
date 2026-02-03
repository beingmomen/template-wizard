import type { WizardState } from '~/types/wizard.types'

export function needsFrontend(state: WizardState) {
  return ['fullstack', 'frontend-only', 'chrome-extension'].includes(state.projectType)
    || state.runtimeTargets?.some(t => ['web', 'mobile', 'desktop'].includes(t))
}

export function needsBackend(state: WizardState) {
  return ['fullstack', 'backend-only'].includes(state.projectType)
}

export function needsDatabase(state: WizardState) {
  return state.techStack?.database !== 'None'
    && state.techStack?.database !== ''
    && !!state.techStack?.database
}

export function needsAuth(state: WizardState) {
  return state.techStack?.auth !== 'None'
    && state.techStack?.auth !== ''
    && !!state.techStack?.auth
}

export function needsAI(state: WizardState) {
  return state.intelligenceLevel !== 'none'
}

export function needsDesktopSystem(state: WizardState) {
  return state.runtimeTargets?.some(t => ['desktop', 'system'].includes(t))
}

export function needsAPI(state: WizardState) {
  return (state.communicationInterfaces?.length > 0)
    || state.runtimeTargets?.some(t => ['desktop', 'cli', 'system'].includes(t))
    || ['fullstack', 'backend-only', 'library', 'integration'].includes(state.projectType)
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

export function needsServerBackend(state: WizardState) {
  return needsBackend(state)
    && (state.runtimeTargets?.some(t => t === 'web')
      || state.communicationInterfaces?.includes('http-api'))
}

export function needsLocalEngine(state: WizardState) {
  return state.runtimeTargets?.some(t => ['desktop', 'system'].includes(t))
    && state.communicationInterfaces?.some(i => ['local-ipc', 'tauri-commands'].includes(i))
    && !state.communicationInterfaces?.includes('http-api')
}

export function isFullyLocal(state: WizardState) {
  return !needsBackend(state)
    && !(state.externalServices?.length > 0)
    && !state.aiConfiguration?.models?.some(m => m.isAPI)
}
