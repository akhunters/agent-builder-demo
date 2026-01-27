'use client'

import { Handle, Position } from '@xyflow/react'
import { ThumbsUp } from 'lucide-react'

export default function UserApprovalNode({ data }: { data: any }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg border border-[#3a3a3a]/50 min-w-[180px] ring-1 ring-white/5 ">
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-sm">
          <ThumbsUp className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-medium text-sm">{data.label || 'User approval'}</span>
      </div>

      {/* Body with Approve/Reject buttons */}
      <div className="px-3 py-2.5 space-y-2">
        <div className="relative">
          <div className="bg-[#2a2a2a] rounded-md px-3 py-2">
            <span className="text-white text-sm">Approve</span>
          </div>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="approved"
            className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
            style={{ top: '50%' }}
          />
        </div>
        <div className="relative">
          <div className="bg-[#2a2a2a] rounded-md px-3 py-2">
            <span className="text-white text-sm">Reject</span>
          </div>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="rejected"
            className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
            style={{ top: '50%' }}
          />
        </div>
      </div>

      {/* Input handle on the left */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
    </div>
  )
}
