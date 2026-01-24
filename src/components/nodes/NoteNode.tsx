'use client'

import { FileText } from 'lucide-react'

export default function NoteNode({ data }: { data: any }) {
  const content = data.content || data.label || 'Note'
  
  return (
    <div className="px-3 py-2 bg-[#fef3c7] rounded shadow-md border border-[#fbbf24] min-w-[180px] max-w-[280px]">
      <div className="flex items-start gap-2">
        <FileText className="w-3.5 h-3.5 text-[#92400e] mt-0.5 flex-shrink-0" />
        <p className="text-[#78350f] text-xs leading-relaxed line-clamp-3 break-words">
          {content}
        </p>
      </div>
    </div>
  )
}
