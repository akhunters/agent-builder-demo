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
    <div className="h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-transparent border-none text-lg font-semibold focus:outline-none focus:ring-0 px-2 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
        />
        <span className="text-xs text-gray-400 px-2 py-1 bg-[#2a2a2a] rounded">
          {workflowStatus === 'draft' ? 'Draft' : 'v1 • production'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-[#2a2a2a] rounded transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#2a2a2a] rounded transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onCode}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors"
        >
          <Code className="w-4 h-4" />
          <span className="text-sm">Code</span>
        </button>
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors"
        >
          <Play className="w-4 h-4" />
          <span className="text-sm">Preview</span>
        </button>
        <button
          onClick={onDeploy}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          <Rocket className="w-4 h-4" />
          <span className="text-sm">Deploy</span>
        </button>
      </div>
    </div>
  )
}
