'use client'

import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'

export default function EndNode({ data }: { data: any }) {
  return (
    <div className="px-3 py-2.5 bg-[#1a1a1a] rounded-xl shadow-lg border border-[#3a3a3a]/50 min-w-[120px] flex items-center gap-2.5 ring-1 ring-white/5">
      <div className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Square className="w-4 h-4 text-white stroke-2" />
      </div>
      <span className="text-white font-medium text-sm">{data.label || 'End'}</span>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
    </div>
  )
}
