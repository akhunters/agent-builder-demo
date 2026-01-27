'use client'

import { Handle, Position } from '@xyflow/react'
import { RotateCcw } from 'lucide-react'

export default function WhileNode({ data }: { data: any }) {
  const condition = data.condition || ''
  
  return (
    <div 
      className="px-3 py-2.5 bg-transparent rounded-xl min-w-[180px] flex items-center gap-2.5 relative"
      style={{ 
        border: '2px dotted #9ca3af',
        borderStyle: 'dotted',
      }}
    >
      <div className="w-6 h-6 rounded-lg bg-[#f97316] flex items-center justify-center flex-shrink-0">
        <RotateCcw className="w-3.5 h-3.5 text-white fill-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium text-sm mb-1">{data.label || 'While'}</div>
        {condition && (
          <div className="text-xs text-[#9ca3af] font-mono truncate" title={condition}>
            {condition}
          </div>
        )}
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-white !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-white !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
      />
    </div>
  )
}
