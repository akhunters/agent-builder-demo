'use client'

import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'

export default function IfElseNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2.5 bg-[#f97316] rounded-lg shadow-md border border-[#ea580c] min-w-[130px]">
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-white fill-white" />
        <span className="text-white font-medium text-sm">{data.label || 'If / Else'}</span>
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#ea580c] !border-[#000] !w-3 !h-3"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="true" 
        className="!bg-[#16a34a] !border-[#000] !w-3 !h-3"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="else" 
        className="!bg-[#6b7280] !border-[#000] !w-3 !h-3"
      />
    </div>
  )
}
