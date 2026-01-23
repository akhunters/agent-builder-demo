'use client'

import { Handle, Position } from '@xyflow/react'
import { Plug } from 'lucide-react'

export default function MCPNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 bg-yellow-500 rounded-lg shadow-lg border-2 border-yellow-400 min-w-[120px]">
      <div className="flex items-center gap-2">
        <Plug className="w-5 h-5 text-white" />
        <span className="text-white font-semibold">{data.label || 'MCP'}</span>
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-yellow-400" />
    </div>
  )
}
