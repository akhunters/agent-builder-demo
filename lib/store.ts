import { create } from 'zustand'
import { Workflow } from '@/types'

const STORAGE_KEY = 'workflow-storage'

interface WorkflowStore {
  workflows: Workflow[]
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  getWorkflow: (id: string) => Workflow | undefined
  getWorkflowsByStatus: (status: 'draft' | 'production') => Workflow[]
  loadWorkflows: () => void
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
    return get().workflows.filter((w) => w.status === status)
  },
}))

// Load workflows on store initialization
if (typeof window !== 'undefined') {
  useWorkflowStore.getState().loadWorkflows()
}
