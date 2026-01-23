'use client'

import { Handle, Position } from '@xyflow/react'
import { Play } from 'lucide-react'

export default function AgentNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2.5 bg-[#3b82f6] rounded-xl shadow-md border border-[#2563eb] min-w-[140px]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <Play className="w-3 h-3 text-white fill-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm truncate">{data.name || data.label || 'Agent'}</div>
          <div className="text-xs text-blue-100 opacity-80">Agent</div>
        </div>
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#2563eb] !border-[#000] !w-3 !h-3"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-[#2563eb] !border-[#000] !w-3 !h-3"
      />
    </div>
  )
}
