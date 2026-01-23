'use client'

import { Handle, Position } from '@xyflow/react'
import { Play } from 'lucide-react'

export default function AgentNode({ data }: { data: any }) {
  const displayName = data.name || data.label || 'Agent'
  const nameParts = displayName.split(' ')
  
  return (
    <div className="px-3 py-2.5 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#2a2a2a] min-w-[140px] flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Play className="w-4 h-4 text-white fill-white rotate-90" />
      </div>
      <div className="flex-1 min-w-0">
        {nameParts.length > 1 ? (
          <>
            <div className="text-white font-medium text-sm leading-tight">{nameParts[0]}</div>
            <div className="text-white font-medium text-xs leading-tight opacity-90">{nameParts.slice(1).join(' ')}</div>
          </>
        ) : (
          <div className="text-white font-medium text-sm">{displayName}</div>
        )}
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
      />
    </div>
  )
}
