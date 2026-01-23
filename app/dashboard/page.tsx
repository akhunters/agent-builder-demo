'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkflowStore } from '@/lib/store'
import { Workflow } from '@/types'
import { Plus, GitBranch } from 'lucide-react'

type TabType = 'workflows' | 'drafts' | 'templates'

export default function Dashboard() {
  const router = useRouter()
  const { workflows, addWorkflow, deleteWorkflow, loadWorkflows } = useWorkflowStore()
  const [activeTab, setActiveTab] = useState<TabType>('workflows')
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    loadWorkflows()
  }, [loadWorkflows])

  useEffect(() => {
    if (activeTab === 'workflows') {
      setFilteredWorkflows(workflows.filter((w) => w.status === 'production'))
    } else if (activeTab === 'drafts') {
      setFilteredWorkflows(workflows.filter((w) => w.status === 'draft'))
    } else {
      // Templates - for now, empty
      setFilteredWorkflows([])
    }
  }, [activeTab, workflows])

  const handleCreateWorkflow = () => {
    const id = addWorkflow({
      name: 'Untitled Workflow',
      status: 'draft',
      version: '1.0.0',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 250, y: 100 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 250, y: 300 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [],
    })
    router.push(`/workflow/${id}`)
  }

  const handleWorkflowClick = (id: string) => {
    router.push(`/workflow/${id}`)
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
        <h1 className="text-2xl font-semibold mb-8">Agent Builder</h1>

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
                onClick={() => handleWorkflowClick(workflow.id)}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 cursor-pointer hover:border-[#3a3a3a] transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eab308] flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{workflow.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-[#6b7280]">
                  {formatDate(workflow.createdAt)} · {workflow.author || 'Composio'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
