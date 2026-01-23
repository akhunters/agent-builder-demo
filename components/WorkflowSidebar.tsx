'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkflowStore } from '@/lib/store'
import { Workflow } from '@/types'
import { X, GitBranch, ChevronRight, ChevronDown, Home } from 'lucide-react'

interface WorkflowSidebarProps {
  currentWorkflowId: string
  onClose?: () => void
}

export default function WorkflowSidebar({ currentWorkflowId, onClose }: WorkflowSidebarProps) {
  const router = useRouter()
  const { workflows, getTemplates } = useWorkflowStore()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    workflows: true,
    drafts: true,
    templates: true,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const productionWorkflows = workflows.filter((w) => w.status === 'production' && !w.isTemplate)
  const draftWorkflows = workflows.filter((w) => w.status === 'draft' && !w.isTemplate)
  const templates = getTemplates()

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleWorkflowClick = (id: string, isTemplate: boolean = false) => {
    if (isTemplate) {
      router.push(`/workflow/${id}?view=true`)
    } else {
      router.push(`/workflow/${id}`)
    }
    onClose?.()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}`
  }

  const renderWorkflowItem = (workflow: Workflow, isTemplate: boolean = false) => {
    const isActive = workflow.id === currentWorkflowId
    return (
      <div
        key={workflow.id}
        onClick={() => handleWorkflowClick(workflow.id, isTemplate)}
        className={`px-3 py-2 rounded-md cursor-pointer transition-colors mb-1 ${
          isActive
            ? 'bg-[#3b82f6]/20 border border-[#3b82f6]'
            : 'hover:bg-[#2a2a2a]'
        }`}
      >
        <div className="flex items-center gap-2">
          <GitBranch className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#3b82f6]' : 'text-[#6b7280]'}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-[#9ca3af]'}`}>
              {workflow.name}
            </p>
            {!isTemplate && (
              <p className="text-xs text-[#6b7280] mt-0.5">
                {formatDate(workflow.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-[#1a1a1a] border-r border-[#2a2a2a] h-full flex flex-col slide-in">
      {/* Header */}
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Workflows</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
            title="Go to Dashboard"
          >
            <Home className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Workflows Section */}
        <div>
          <button
            onClick={() => toggleSection('workflows')}
            className="w-full flex items-center justify-between mb-2 text-sm font-medium text-white hover:text-[#3b82f6] transition-colors"
          >
            <span>Workflows {isMounted && `(${productionWorkflows.length})`}</span>
            {expandedSections.workflows ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.workflows && (
            <div className="ml-2">
              {productionWorkflows.length === 0 ? (
                <p className="text-xs text-[#6b7280] px-3 py-2">No workflows</p>
              ) : (
                productionWorkflows.map((workflow) => renderWorkflowItem(workflow))
              )}
            </div>
          )}
        </div>

        {/* Drafts Section */}
        <div>
          <button
            onClick={() => toggleSection('drafts')}
            className="w-full flex items-center justify-between mb-2 text-sm font-medium text-white hover:text-[#3b82f6] transition-colors"
          >
            <span>Drafts {isMounted && `(${draftWorkflows.length})`}</span>
            {expandedSections.drafts ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.drafts && (
            <div className="ml-2">
              {draftWorkflows.length === 0 ? (
                <p className="text-xs text-[#6b7280] px-3 py-2">No drafts</p>
              ) : (
                draftWorkflows.map((workflow) => renderWorkflowItem(workflow))
              )}
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div>
          <button
            onClick={() => toggleSection('templates')}
            className="w-full flex items-center justify-between mb-2 text-sm font-medium text-white hover:text-[#3b82f6] transition-colors"
          >
            <span>Templates {isMounted && `(${templates.length})`}</span>
            {expandedSections.templates ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.templates && (
            <div className="ml-2">
              {templates.length === 0 ? (
                <p className="text-xs text-[#6b7280] px-3 py-2">No templates</p>
              ) : (
                templates.map((workflow) => renderWorkflowItem(workflow, true))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
