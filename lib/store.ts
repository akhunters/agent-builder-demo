import { create } from 'zustand'
import { Workflow } from '@/types'
import { TEMPLATES } from './templates'

const STORAGE_KEY = 'workflow-storage'

interface WorkflowStore {
  workflows: Workflow[]
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  getWorkflow: (id: string) => Workflow | undefined
  getWorkflowsByStatus: (status: 'draft' | 'production') => Workflow[]
  getTemplates: () => Workflow[]
  loadWorkflows: () => void
  initializeTemplates: () => void
  clearAllData: () => void
}

const loadFromStorage = (): Workflow[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state?.workflows || parsed.workflows || []
    }
  } catch (error) {
    console.error('Failed to load workflows from storage:', error)
  }
  return []
}

const saveToStorage = (workflows: Workflow[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ workflows }))
  } catch (error) {
    console.error('Failed to save workflows to storage:', error)
  }
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  
  loadWorkflows: () => {
    const workflows = loadFromStorage()
    set({ workflows })
  },

  addWorkflow: (workflow) => {
    const id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const workflows = [...get().workflows, newWorkflow]
    set({ workflows })
    saveToStorage(workflows)
    return id
  },

  updateWorkflow: (id, updates) => {
    const workflows = get().workflows.map((w) =>
      w.id === id
        ? { ...w, ...updates, updatedAt: new Date().toISOString() }
        : w
    )
    set({ workflows })
    saveToStorage(workflows)
  },

  deleteWorkflow: (id) => {
    const workflows = get().workflows.filter((w) => w.id !== id)
    set({ workflows })
    saveToStorage(workflows)
  },

  getWorkflow: (id) => {
    return get().workflows.find((w) => w.id === id)
  },

  getWorkflowsByStatus: (status) => {
    return get().workflows.filter((w) => w.status === status && !w.isTemplate)
  },

  getTemplates: () => {
    return get().workflows.filter((w) => w.isTemplate === true)
  },

  initializeTemplates: () => {
    const existing = get().workflows
    const existingTemplateIds = existing.filter((w) => w.isTemplate).map((w) => w.id)
    
    const templatesToAdd = Object.values(TEMPLATES).filter(
      (template) => !existingTemplateIds.includes(template.id)
    )

    if (templatesToAdd.length > 0) {
      const newWorkflows = templatesToAdd.map((template) => ({
        ...template.workflow,
        id: template.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      
      const workflows = [...existing, ...newWorkflows]
      set({ workflows })
      saveToStorage(workflows)
    }
  },

  clearAllData: () => {
    if (typeof window === 'undefined') return
    
    // Clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY)
      // Also try to clear any other potential storage keys
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('workflow') || key.includes('xyflow') || key.includes('react-flow')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }

    // Clear IndexedDB if it exists
      if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              const deleteRequest = indexedDB.deleteDatabase(db.name)
              deleteRequest.onerror = () => {
                console.error(`Failed to delete database ${db.name}`)
              }
            }
          })
        }).catch(err => {
          console.error('Failed to clear IndexedDB:', err)
        })
      }

    // Reset state
    set({ workflows: [] })
    
    // Re-initialize templates
    setTimeout(() => {
      get().initializeTemplates()
    }, 100)
  },
}))

// Load workflows on store initialization
if (typeof window !== 'undefined') {
  useWorkflowStore.getState().loadWorkflows()
}
