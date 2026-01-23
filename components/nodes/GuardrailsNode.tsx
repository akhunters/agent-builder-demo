'use client'

import { Handle, Position } from '@xyflow/react'
import { Shield } from 'lucide-react'

export default function GuardrailsNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2.5 bg-[#eab308] rounded-lg shadow-md border border-[#ca8a04] min-w-[130px]">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-white fill-white" />
        <span className="text-white font-medium text-sm">{data.label || 'Guardrails'}</span>
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-[#ca8a04] !border-[#000] !w-3 !h-3"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="pass" 
        className="!bg-[#16a34a] !border-[#000] !w-3 !h-3"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="fail" 
        className="!bg-[#ef4444] !border-[#000] !w-3 !h-3"
      />
    </div>
  )
}
