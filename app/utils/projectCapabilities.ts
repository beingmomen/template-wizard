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
