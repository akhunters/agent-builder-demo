'use client'

import { Handle, Position } from '@xyflow/react'
import { List } from 'lucide-react'

export default function ClassifyNode({ data }: { data: any }) {
  const categories = data.categories || []
  const displayName = data.name || data.label || 'Classify'
  
  return (
    <div className="px-3 py-2.5 bg-[#1a1a1a] rounded-xl shadow-lg border border-[#3a3a3a]/50 min-w-[140px] ring-1 ring-white/5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-sm">
          <List className="w-4 h-4 text-white fill-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm">{displayName}</div>
        </div>
      </div>
      
      {categories.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {categories.map((category: string, index: number) => (
            <div key={index} className="relative">
              <div className="bg-[#2a2a2a] rounded-md px-2 py-1">
                <span className="text-white text-xs">{category}</span>
              </div>
              <Handle 
                type="source" 
                position={Position.Right} 
                id={category}
                className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
                style={{ 
                  top: categories.length === 1 
                    ? '50%' 
                    : `${35 + (index / (categories.length - 1)) * 30}%`
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
      />
    </div>
  )
}
