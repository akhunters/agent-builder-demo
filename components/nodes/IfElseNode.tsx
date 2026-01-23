'use client'

import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'

export default function IfElseNode({ data }: { data: any }) {
  return (
    <div className="px-3 py-2.5 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#2a2a2a] min-w-[130px] flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-sm">
        <GitBranch className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="text-white font-medium text-sm">{data.label || 'If / Else'}</span>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true" 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="else" 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !bottom-[-6px]"
      />
    </div>
  )
}
