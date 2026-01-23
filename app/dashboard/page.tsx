'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkflowStore } from '@/lib/store'
import { Workflow } from '@/types'
import { Plus, GitBranch, Trash2, Eye, Trash } from 'lucide-react'

type TabType = 'workflows' | 'drafts' | 'templates'

export default function Dashboard() {
  const router = useRouter()
  const { workflows, addWorkflow, deleteWorkflow, loadWorkflows, getTemplates, initializeTemplates, clearAllData } = useWorkflowStore()
  const [activeTab, setActiveTab] = useState<TabType>('workflows')
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    loadWorkflows()
    initializeTemplates()
  }, [loadWorkflows, initializeTemplates])

  const productionWorkflows = workflows.filter((w) => w.status === 'production' && !w.isTemplate)
  const draftWorkflows = workflows.filter((w) => w.status === 'draft' && !w.isTemplate)
  const templates = getTemplates()

  useEffect(() => {
    if (activeTab === 'workflows') {
      setFilteredWorkflows(productionWorkflows)
    } else if (activeTab === 'drafts') {
      setFilteredWorkflows(draftWorkflows)
    } else {
      setFilteredWorkflows(templates)
    }
  }, [activeTab, workflows, productionWorkflows, draftWorkflows, templates])

  const handleCreateWorkflow = () => {
    const id = addWorkflow({
      name: 'Untitled Workflow',
      status: 'draft',
      version: '1.0.0',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 100, y: 200 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 300, y: 200 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [],
    })
    router.push(`/workflow/${id}`)
  }

  const handleWorkflowClick = (id: string) => {
    if (!id) {
      console.error('Workflow ID is missing')
      return
    }
    
    console.log('Navigating to workflow:', id)
    console.log('All workflows:', workflows.map(w => ({ id: w.id, name: w.name })))
    
    const path = `/workflow/${encodeURIComponent(id)}`
    console.log('Path:', path)
    
    // Use window.location as primary method for more reliable navigation
    try {
      window.location.href = path
    } catch (error) {
      console.error('Navigation failed:', error)
      // Fallback to router
      router.push(path)
    }
  }

  const handleTemplateClick = (templateId: string, action: 'view' | 'use') => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      if (action === 'view') {
        // View template in read-only mode
        const path = `/workflow/${encodeURIComponent(templateId)}?view=true`
        console.log('Navigating to template view:', path)
        try {
          window.location.href = path
        } catch (error) {
          console.error('Navigation failed:', error)
          router.push(path)
        }
      } else {
        // Create a new workflow from template
        const newId = addWorkflow({
          ...template,
          name: `${template.name} (Copy)`,
          isTemplate: false,
          status: 'draft',
        })
        const path = `/workflow/${encodeURIComponent(newId)}`
        console.log('Navigating to new workflow from template:', path)
        try {
          window.location.href = path
        } catch (error) {
          console.error('Navigation failed:', error)
          router.push(path)
        }
      }
    }
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name })
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteWorkflow(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  const handleClearAll = () => {
    setClearConfirm(true)
  }

  const confirmClearAll = () => {
    clearAllData()
    setClearConfirm(false)
    // Reload page to reset everything
    window.location.reload()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Agent Builder</h1>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm text-red-400 font-medium transition-colors flex items-center gap-2"
            title="Clear all workflows and data"
          >
            <Trash className="w-4 h-4" />
            Clear All Data
          </button>
        </div>

        {/* Create Workflow Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-2">Create a workflow</h2>
          <p className="text-[#9ca3af] mb-6">Build a chat agent workflow with custom logic and tools</p>
          <button
            onClick={handleCreateWorkflow}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'workflows'
                ? 'text-white border-b-2 border-white pb-2'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            Workflows
            {isMounted && <span className="ml-2 text-xs text-[#6b7280]">({productionWorkflows.length})</span>}
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'text-white border-b-2 border-white pb-2'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            Drafts
            {isMounted && <span className="ml-2 text-xs text-[#6b7280]">({draftWorkflows.length})</span>}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'text-white border-b-2 border-white pb-2'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            Templates
            {isMounted && <span className="ml-2 text-xs text-[#6b7280]">({templates.length})</span>}
          </button>
        </div>

        {/* Workflow Cards */}
        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b7280]">No {activeTab} found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                onClick={(e) => {
                  if (activeTab !== 'templates' && workflow.id) {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Card clicked, workflow ID:', workflow.id)
                    handleWorkflowClick(workflow.id)
                  }
                }}
                className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#3a3a3a] transition-colors relative group ${
                  activeTab !== 'templates' ? 'cursor-pointer' : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eab308] flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{workflow.name}</h3>
                    {workflow.description && (
                      <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">{workflow.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#6b7280]">
                    {activeTab === 'templates' ? 'Template' : `${formatDate(workflow.createdAt)} · ${workflow.author || 'Composio'}`}
                  </p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeTab === 'templates' ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleTemplateClick(workflow.id, 'view')
                          }}
                          className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
                          title="View template"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleTemplateClick(workflow.id, 'use')
                          }}
                          className="px-3 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-xs text-white font-medium transition-colors"
                          title="Use template"
                        >
                          Use
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Button clicked, workflow ID:', workflow.id, 'Type:', typeof workflow.id)
                            if (workflow.id) {
                              handleWorkflowClick(workflow.id)
                            } else {
                              console.error('Workflow ID is undefined or null')
                            }
                          }}
                          className="px-3 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-xs text-white font-medium transition-colors z-10 relative"
                          title="Open workflow"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDelete(workflow.id, workflow.name)
                          }}
                          className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-[#9ca3af] hover:text-red-400"
                          title="Delete workflow"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-2">Delete Workflow</h3>
              <p className="text-sm text-[#9ca3af] mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Data Confirmation Modal */}
        {clearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setClearConfirm(false)}>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-2">Clear All Data</h3>
              <p className="text-sm text-[#9ca3af] mb-6">
                Are you sure you want to clear all workflows, drafts, and data? This will delete everything including localStorage and IndexedDB. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setClearConfirm(false)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearAll}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
