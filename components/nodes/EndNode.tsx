'use client'

import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'

export default function EndNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2.5 bg-[#22c55e] rounded-lg shadow-md border border-[#16a34a] min-w-[100px]">
      <div className="flex items-center gap-2">
        <Square className="w-4 h-4 text-white stroke-2" />
        <span className="text-white font-medium text-sm">{data.label || 'End'}</span>
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#16a34a] !border-[#000] !w-3 !h-3"
      />
    </div>
  )
}
