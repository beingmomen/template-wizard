import { nanoid } from 'nanoid'
import { useDebounceFn } from '@vueuse/core'
import { initialWizardState, WIZARD_STEPS, ALL_PROJECT_TYPES } from '~/types/wizard.types'
import type { WizardState, WizardStep, ProjectType } from '~/types/wizard.types'

const STORAGE_KEY = 'project-template-wizard-state'
const DEVICE_ID_KEY = 'wizard-device-id'
const CURRENT_PROJECT_KEY = 'current-project-id'

export function useWizardState() {
  const state = useState<WizardState>('wizard-state', () => ({ ...initialWizardState }))
  const currentStep = useState<number>('wizard-current-step', () => 0)
  const currentProjectId = useState<string | null>('wizard-current-project-id', () => null)
  const isSaving = useState<boolean>('wizard-is-saving', () => false)
  const isAutoSaving = useState<boolean>('wizard-is-auto-saving', () => false)
  const lastSaved = useState<Date | null>('wizard-last-saved', () => null)
  const isLoading = useState<boolean>('wizard-is-loading', () => false)
  const skipNextAutoSave = useState<boolean>('wizard-skip-auto-save', () => false)

  // Computed: Get visible steps based on project type
  const visibleSteps = computed<WizardStep[]>(() => {
    const projectType = state.value.projectType || 'fullstack'
    return WIZARD_STEPS.filter(step => {
      if (!step.visibleFor) return true
      return step.visibleFor.includes(projectType)
    })
  })

  // Helper: Check if project needs frontend
  const needsFrontend = computed(() =>
    ['fullstack', 'frontend-only', 'chrome-extension'].includes(state.value.projectType)
  )

  // Helper: Check if project needs backend
  const needsBackend = computed(() =>
    ['fullstack', 'backend-only'].includes(state.value.projectType)
  )

  // Helper: Check if project needs database
  const needsDatabase = computed(() =>
    ['fullstack', 'backend-only'].includes(state.value.projectType)
  )

  // Helper: Check if a specific step is visible
  const isStepVisible = (stepId: number): boolean => {
    return visibleSteps.value.some(s => s.id === stepId)
  }

  // Helper: Get visible step index from step id
  const getVisibleStepIndex = (stepId: number): number => {
    return visibleSteps.value.findIndex(s => s.id === stepId)
  }

  // Helper: Get step id from visible index
  const getStepIdFromVisibleIndex = (visibleIndex: number): number => {
    return visibleSteps.value[visibleIndex]?.id ?? 0
  }

  // Computed: Check if current project requires extended features
  const requiresExtendedFeatures = computed(() => state.value.projectSize !== 'small')

  // Computed: Is last step?
  const isLastStep = computed(() => currentStep.value === visibleSteps.value.length - 1)

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
  }

  // Update nested field
  const updateNestedField = <K extends keyof WizardState, NK extends keyof WizardState[K]>(
    key: K,
    nestedKey: NK,
    value: WizardState[K][NK]
  ) => {
    // @ts-ignore - TypeScript has trouble with this nested update
    state.value[key][nestedKey] = value
  }

  // Go to next step
  const nextStep = () => {
    if (currentStep.value < visibleSteps.value.length - 1) {
      currentStep.value++
    }
  }

  // Go to previous step
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  // Go to specific step (visible index)
  const goToStep = (step: number) => {
    if (step >= 0 && step < visibleSteps.value.length) {
      currentStep.value = step
    }
  }

  // Get current step info
  const currentStepInfo = computed(() => visibleSteps.value[currentStep.value])

  // Reset state to initial
  const resetState = () => {
    state.value = { ...initialWizardState }
    currentStep.value = 0
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(CURRENT_PROJECT_KEY)
    }
  }

  // Save state to localStorage (cache only)
  const saveToLocalStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
      } catch (e) {
        console.error('Failed to save to localStorage:', e)
      }
    }
  }

  // Save to database
  const saveToDatabase = async () => {
    if (!currentProjectId.value) return

    isAutoSaving.value = true
    try {
      await $fetch('/api/projects', {
        method: 'POST',
        body: {
          projectId: currentProjectId.value,
          data: state.value
        }
      })
      lastSaved.value = new Date()
      saveToLocalStorage()
    } catch (e) {
      console.error('Failed to save to database:', e)
    } finally {
      setTimeout(() => {
        isAutoSaving.value = false
      }, 500)
    }
  }

  // Debounced auto-save function (1000ms delay)
  const debouncedAutoSave = useDebounceFn(() => {
    saveToDatabase()
  }, 1000)

  // Deep watch on state to auto-save any changes
  watch(
    () => state.value,
    () => {
      if (skipNextAutoSave.value) {
        skipNextAutoSave.value = false
        return
      }
      if (import.meta.client && currentProjectId.value && !isLoading.value) {
        debouncedAutoSave()
      }
    },
    { deep: true }
  )

  const migrateFrontendMode = (data: Record<string, any>) => {
    if (!data.frontendMode) {
      const hasExistingFrontend = (data.frontendModules?.length > 0) || (data.pages?.length > 0)
      data.frontendMode = hasExistingFrontend ? 'custom' : 'template'
    }
    if (data.selectedTemplate === undefined) {
      data.selectedTemplate = null
    }
    return data
  }

  // Load state from localStorage (cache)
  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = migrateFrontendMode(JSON.parse(saved))
          state.value = { ...initialWizardState, ...parsed }
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e)
      }
    }
  }

  // Create a new project in database
  const createProject = async (): Promise<string | null> => {
    isSaving.value = true
    try {
      const response = await $fetch('/api/projects', {
        method: 'POST',
        body: {
          data: { ...initialWizardState }
        }
      })

      if (response.projectId) {
        currentProjectId.value = response.projectId
        state.value = { ...initialWizardState }
        currentStep.value = 0
        return response.projectId
      }
      return null
    } catch (error) {
      console.error('Failed to create project:', error)
      return null
    } finally {
      isSaving.value = false
    }
  }

  // Load project from database
  const loadProject = async (projectId: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await $fetch(`/api/projects/${projectId}`)

      if (response.project) {
        skipNextAutoSave.value = true
        const migratedData = migrateFrontendMode(response.project.data)
        state.value = { ...initialWizardState, ...migratedData }
        currentProjectId.value = projectId
        saveToLocalStorage()
        currentStep.value = 0
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to load project:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Save to MongoDB Cloud (manual save - kept for compatibility)
  const saveToCloud = async (): Promise<{ success: boolean; projectId?: string; error?: string }> => {
    if (!currentProjectId.value) {
      const newProjectId = await createProject()
      if (newProjectId) {
        return { success: true, projectId: newProjectId }
      }
      return { success: false, error: 'فشل في إنشاء المشروع' }
    }

    isSaving.value = true
    try {
      await $fetch('/api/projects', {
        method: 'POST',
        body: {
          projectId: currentProjectId.value,
          data: state.value
        }
      })
      return { success: true, projectId: currentProjectId.value }
    } catch (error) {
      console.error('Failed to save to cloud:', error)
      return { success: false, error: 'فشل في حفظ المشروع' }
    } finally {
      isSaving.value = false
    }
  }

  // Load from MongoDB Cloud (kept for compatibility)
  const loadFromCloud = async (projectId: string): Promise<{ success: boolean; error?: string }> => {
    const success = await loadProject(projectId)
    if (success) {
      return { success: true }
    }
    return { success: false, error: 'فشل في تحميل المشروع' }
  }

  // Fetch projects list from MongoDB with pagination and filtering
  const fetchProjects = async (options?: {
    page?: number
    limit?: number
    status?: string
    archived?: boolean
  }): Promise<{
    projects: Array<{
      projectId: string
      projectName: string
      projectNameTechnical: string
      projectStatus: string
      createdAt: string
      updatedAt: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    try {
      const params = new URLSearchParams()
      if (options?.page) params.append('page', String(options.page))
      if (options?.limit) params.append('limit', String(options.limit))
      if (options?.status) params.append('status', options.status)
      if (options?.archived) params.append('archived', 'true')

      const response = await $fetch(`/api/projects?${params}`)
      return {
        projects: response.projects || [],
        pagination: response.pagination || { page: 1, limit: 5, total: 0, totalPages: 0 }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      return {
        projects: [],
        pagination: { page: 1, limit: 5, total: 0, totalPages: 0 }
      }
    }
  }

  // Fetch project counts by status
  const fetchProjectCounts = async (): Promise<{
    all: number
    planning: number
    planned: number
    completed: number
    archived: number
  }> => {
    try {
      const response = await $fetch('/api/projects?countOnly=true')
      return response.counts || { all: 0, planning: 0, planned: 0, completed: 0, archived: 0 }
    } catch (error) {
      console.error('Failed to fetch project counts:', error)
      return { all: 0, planning: 0, planned: 0, completed: 0, archived: 0 }
    }
  }

  // Update project status
  const updateProjectStatus = async (projectId: string, status: string): Promise<boolean> => {
    try {
      const response = await $fetch(`/api/projects/${projectId}`)
      if (response.project) {
        const updatedData = { ...response.project.data, projectStatus: status }
        await $fetch('/api/projects', {
          method: 'POST',
          body: { projectId, data: updatedData }
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update project status:', error)
      return false
    }
  }

  // Delete project from MongoDB (hard delete)
  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      await $fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (currentProjectId.value === projectId) {
        currentProjectId.value = null
        state.value = { ...initialWizardState }
        if (import.meta.client) {
          localStorage.removeItem(STORAGE_KEY)
          localStorage.removeItem(CURRENT_PROJECT_KEY)
        }
      }
      return true
    } catch (error) {
      console.error('Failed to delete project:', error)
      return false
    }
  }

  // Soft delete project (archive)
  const softDeleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const response = await $fetch(`/api/projects/${projectId}`)
      if (response.project) {
        const updatedData = {
          ...response.project.data,
          deletedAt: new Date().toISOString()
        }
        await $fetch('/api/projects', {
          method: 'POST',
          body: { projectId, data: updatedData }
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to soft delete project:', error)
      return false
    }
  }

  // Restore archived project
  const restoreProject = async (projectId: string): Promise<boolean> => {
    try {
      const response = await $fetch(`/api/projects/${projectId}`)
      if (response.project) {
        const updatedData = {
          ...response.project.data,
          deletedAt: null
        }
        await $fetch('/api/projects', {
          method: 'POST',
          body: { projectId, data: updatedData }
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to restore project:', error)
      return false
    }
  }

  return {
    state,
    currentStep,
    currentProjectId,
    currentStepInfo,
    visibleSteps,
    requiresExtendedFeatures,
    isLastStep,
    isFirstStep,
    isSaving,
    isAutoSaving,
    isLoading,
    lastSaved,
    needsFrontend,
    needsBackend,
    needsDatabase,
    isStepVisible,
    getVisibleStepIndex,
    getStepIdFromVisibleIndex,
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
    createProject,
    loadProject,
    fetchProjects,
    fetchProjectCounts,
    updateProjectStatus,
    deleteProject,
    softDeleteProject,
    restoreProject,
    getDeviceId,
    getCurrentProjectId,
    setCurrentProjectId
  }
}
