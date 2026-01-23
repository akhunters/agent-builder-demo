'use client'

import { Code, Play, Rocket, MoreVertical, Settings } from 'lucide-react'

interface TopBarProps {
  workflowName: string
  workflowStatus: 'draft' | 'production'
  onNameChange: (name: string) => void
  onStatusChange: (status: 'draft' | 'production') => void
  onPreview: () => void
  onCode: () => void
  onDeploy: () => void
}

export default function TopBar({
  workflowName,
  workflowStatus,
  onNameChange,
  onStatusChange,
  onPreview,
  onCode,
  onDeploy,
}: TopBarProps) {
  return (
    <div className="h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-transparent border-none text-base font-semibold text-white focus:outline-none focus:ring-0 px-2 py-1 rounded hover:bg-[#2a2a2a] transition-colors placeholder:text-[#6b7280]"
          placeholder="Workflow name"
        />
        <span className="text-xs text-[#9ca3af] px-2.5 py-1 bg-[#2a2a2a] rounded-md font-medium">
          {workflowStatus === 'draft' ? 'Draft' : 'v1 • production'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="p-2 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white">
          <MoreVertical className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white">
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onCode}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md transition-colors text-white text-sm font-medium"
        >
          <Code className="w-4 h-4" />
          <span>Code</span>
        </button>
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md transition-colors text-white text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          <span>Preview</span>
        </button>
        <button
          onClick={onDeploy}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#f97316] hover:bg-[#ea580c] rounded-md transition-colors text-white text-sm font-medium"
        >
          <Rocket className="w-4 h-4" />
          <span>Deploy</span>
        </button>
      </div>
    </div>
  )
}
