import { nanoid } from 'nanoid'
import { useDebounceFn } from '@vueuse/core'
import { initialWizardState, WIZARD_STEPS } from '~/types/wizard.types'
import type { WizardState, WizardStep } from '~/types/wizard.types'

const STORAGE_KEY = 'project-template-wizard-state'
const DEVICE_ID_KEY = 'wizard-device-id'
const CURRENT_PROJECT_KEY = 'current-project-id'

export function useWizardState() {
  // Central state using useState for SSR compatibility
  const state = useState<WizardState>('wizard-state', () => ({ ...initialWizardState }))
  const currentStep = useState<number>('wizard-current-step', () => 0)
  const isSaving = useState<boolean>('wizard-is-saving', () => false)
  const isAutoSaving = useState<boolean>('wizard-is-auto-saving', () => false)
  const lastSaved = useState<Date | null>('wizard-last-saved', () => null)

  // Computed: Get visible steps
  const visibleSteps = computed<WizardStep[]>(() => WIZARD_STEPS)

  // Computed: Check if current project requires extended features
  const requiresExtendedFeatures = computed(() => state.value.projectSize !== 'small')

  // Computed: Is last step?
  const isLastStep = computed(() => currentStep.value === WIZARD_STEPS.length - 1)

  // Computed: Is first step?
  const isFirstStep = computed(() => currentStep.value === 0)

  // Get or create device ID
  const getDeviceId = (): string => {
    if (!import.meta.client) return ''

    let deviceId = localStorage.getItem(DEVICE_ID_KEY)
    if (!deviceId) {
      deviceId = nanoid(16)
      localStorage.setItem(DEVICE_ID_KEY, deviceId)
    }
    return deviceId
  }

  // Get current project ID
  const getCurrentProjectId = (): string | null => {
    if (!import.meta.client) return null
    return localStorage.getItem(CURRENT_PROJECT_KEY)
  }

  // Set current project ID
  const setCurrentProjectId = (projectId: string | null) => {
    if (!import.meta.client) return
    if (projectId) {
      localStorage.setItem(CURRENT_PROJECT_KEY, projectId)
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY)
    }
  }

  // Update specific field in state
  const updateField = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    state.value[key] = value
    saveToLocalStorage()
  }

  // Update nested field
  const updateNestedField = <K extends keyof WizardState, NK extends keyof WizardState[K]>(
    key: K,
    nestedKey: NK,
    value: WizardState[K][NK]
  ) => {
    // @ts-ignore - TypeScript has trouble with this nested update
    state.value[key][nestedKey] = value
    saveToLocalStorage()
  }

  // Go to next step
  const nextStep = () => {
    if (currentStep.value < WIZARD_STEPS.length - 1) {
      currentStep.value++
    }
  }

  // Go to previous step
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  // Go to specific step
  const goToStep = (step: number) => {
    if (step >= 0 && step < WIZARD_STEPS.length) {
      currentStep.value = step
    }
  }

  // Reset state to initial
  const resetState = () => {
    state.value = { ...initialWizardState }
    currentStep.value = 0
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(CURRENT_PROJECT_KEY)
    }
  }

  // Save state to localStorage
  const saveToLocalStorage = () => {
    if (import.meta.client) {
      isAutoSaving.value = true
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
        lastSaved.value = new Date()
      } catch (e) {
        console.error('Failed to save wizard state:', e)
      } finally {
        // Hide saving indicator after a short delay
        setTimeout(() => {
          isAutoSaving.value = false
        }, 500)
      }
    }
  }

  // Debounced auto-save function (300ms delay)
  const debouncedAutoSave = useDebounceFn(() => {
    saveToLocalStorage()
  }, 300)

  // Deep watch on state to auto-save any changes
  watch(
    () => state.value,
    () => {
      if (import.meta.client) {
        debouncedAutoSave()
      }
    },
    { deep: true }
  )

  // Load state from localStorage
  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          // Merge with initial state to handle new fields
          state.value = { ...initialWizardState, ...parsed }
        }
      } catch (e) {
        console.error('Failed to load wizard state:', e)
      }
    }
  }

  // Save to MongoDB Cloud
  const saveToCloud = async (): Promise<{ success: boolean; projectId?: string; error?: string }> => {
    if (!import.meta.client) return { success: false, error: 'Not on client' }

    isSaving.value = true
    try {
      const deviceId = getDeviceId()
      const projectId = getCurrentProjectId()

      const response = await $fetch('/api/projects', {
        method: 'POST',
        body: {
          data: state.value,
          deviceId,
          projectId
        }
      })

      if (response.projectId) {
        setCurrentProjectId(response.projectId)
      }

      return { success: true, projectId: response.projectId }
    } catch (error) {
      console.error('Failed to save to cloud:', error)
      return { success: false, error: 'فشل في حفظ المشروع' }
    } finally {
      isSaving.value = false
    }
  }

  // Load from MongoDB Cloud
  const loadFromCloud = async (projectId: string): Promise<{ success: boolean; error?: string }> => {
    if (!import.meta.client) return { success: false, error: 'Not on client' }

    try {
      const deviceId = getDeviceId()
      const response = await $fetch(`/api/projects/${projectId}`, {
        query: { deviceId }
      })

      if (response.project) {
        state.value = { ...initialWizardState, ...response.project.data }
        setCurrentProjectId(projectId)
        saveToLocalStorage()
        currentStep.value = 0
      }

      return { success: true }
    } catch (error) {
      console.error('Failed to load from cloud:', error)
      return { success: false, error: 'فشل في تحميل المشروع' }
    }
  }

  // Fetch projects list from MongoDB
  const fetchProjects = async (): Promise<Array<{
    projectId: string
    projectName: string
    projectNameTechnical: string
    createdAt: string
    updatedAt: string
  }>> => {
    if (!import.meta.client) return []

    try {
      const deviceId = getDeviceId()
      const response = await $fetch('/api/projects', {
        query: { deviceId }
      })
      return response.projects || []
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      return []
    }
  }

  // Initialize - load from localStorage on client
  onMounted(() => {
    loadFromLocalStorage()
  })

  return {
    state,
    currentStep,
    visibleSteps,
    requiresExtendedFeatures,
    isLastStep,
    isFirstStep,
    isSaving,
    isAutoSaving,
    lastSaved,
    updateField,
    updateNestedField,
    nextStep,
    prevStep,
    goToStep,
    resetState,
    saveToLocalStorage,
    loadFromLocalStorage,
    saveToCloud,
    loadFromCloud,
    fetchProjects,
    getDeviceId,
    getCurrentProjectId,
    setCurrentProjectId
  }
}
