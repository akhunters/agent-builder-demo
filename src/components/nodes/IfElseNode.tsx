'use client'

import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'

export default function IfElseNode({ data }: { data: any }) {
  const conditions = data.conditions || [{ expression: '' }]
  const ifCondition = conditions[0]?.expression || ''
  const hasElse = conditions.length > 1 || data.showElse

  return (
    <div className="px-2.5 py-2 bg-[#1a1a1a] rounded-xl shadow-lg border border-[#3a3a3a]/50 min-w-[200px] max-w-[240px] ring-1 ring-white/5">
      {/* Header - Compact */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-lg bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-sm">
          <GitBranch className="w-3.5 h-3.5 text-white fill-white" />
        </div>
        <span className="text-white font-medium text-xs">{data.label || 'If / Else'}</span>
      </div>

      {/* If Condition - Compact */}
      <div className="mb-1.5 relative">
        <div className="bg-[#2a2a2a] rounded-md px-2 py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9ca3af] font-medium">If</span>
          </div>
          <div className="text-white text-xs font-mono truncate mt-0.5" title={ifCondition || 'input.output_parsed.classification == "flight_info"'}>
            {ifCondition || 'input.output_parsed.classification == "flight_info"'}
          </div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="true"
          className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
          style={{ top: '50%' }}
        />
      </div>

      {/* Else Condition - Compact */}
      {hasElse && (
        <div className="relative">
          <div className="bg-[#2a2a2a] rounded-md px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9ca3af] font-medium">Else</span>
            </div>
            <div className="text-white text-xs mt-0.5">Else</div>
          </div>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="else"
            className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
            style={{ top: '50%' }}
          />
        </div>
      )}

      {/* Input Handle - positioned at top left */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ top: '16px' }}
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
    </div>
  )
}
