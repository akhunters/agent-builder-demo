'use client'

import { Handle, Position } from '@xyflow/react'
import { UserCheck } from 'lucide-react'

export default function UserApprovalNode({ data }: { data: any }) {
  return (
    <div className="px-3 py-2.5 bg-[#1a1a1a] rounded-xl shadow-lg border border-[#3a3a3a]/50 min-w-[140px] flex items-center gap-2.5 ring-1 ring-white/5">
      <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-sm">
        <UserCheck className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="text-white font-medium text-sm">{data.label || 'User Approval'}</span>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="approved"
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="rejected"
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
        style={{ top: '60%' }}
      />
    </div>
  )
}
