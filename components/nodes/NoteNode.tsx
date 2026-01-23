'use client'

import { FileText } from 'lucide-react'

export default function NoteNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 bg-yellow-100 rounded-lg shadow-lg border-2 border-yellow-300 min-w-[200px] max-w-[300px]">
      <div className="flex items-start gap-2">
        <FileText className="w-4 h-4 text-yellow-800 mt-0.5 flex-shrink-0" />
        <p className="text-yellow-900 text-sm">{data.content || data.label || 'Note'}</p>
      </div>
    </div>
  )
}
