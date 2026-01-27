'use client'

import { useState } from 'react'
import {
  Play,
  Square,
  FileText,
  FolderSearch,
  Shield,
  Plug,
  GitBranch,
  RotateCcw,
  UserCheck,
  ArrowRightLeft,
  CircleDot,
  Search,
  List,
} from 'lucide-react'
import { NodeType, NodeCategory, NodeDefinition } from '@/types'

interface NodePaletteProps {
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void
}

const nodeDefinitions: NodeDefinition[] = [
  // Core
  {
    type: 'start',
    category: 'core',
    label: 'Start',
    icon: 'play',
    color: 'bg-green-500',
    description: 'Entry point of the workflow',
  },
  {
    type: 'agent',
    category: 'core',
    label: 'Agent',
    icon: 'play',
    color: 'bg-blue-500',
    description: 'Call the model with your instructions and tools',
  },
  {
    type: 'classify',
    category: 'core',
    label: 'Classify',
    icon: 'list',
    color: 'bg-orange-500',
    description: 'Sort messages into categories with a model',
  },
  {
    type: 'end',
    category: 'core',
    label: 'End',
    icon: 'square',
    color: 'bg-green-500',
    description: 'Ends the flow and returns workflow output',
  },
  {
    type: 'note',
    category: 'core',
    label: 'Note',
    icon: 'file-text',
    color: 'bg-gray-500',
    description: 'Add a sticky note for documentation',
  },
  // Tools
  {
    type: 'fileSearch',
    category: 'tools',
    label: 'File Search',
    icon: 'folder-search',
    color: 'bg-yellow-500',
    description: 'Queries the vector store for relevant information',
  },
  {
    type: 'guardrails',
    category: 'tools',
    label: 'Guardrails',
    icon: 'shield',
    color: 'bg-yellow-500',
    description: 'Adds PII, jailbreak, hallucination checks & moderation',
  },
  {
    type: 'mcp',
    category: 'tools',
    label: 'MCP',
    icon: 'plug',
    color: 'bg-yellow-500',
    description: 'Connect to external tools via Model Context Protocol',
  },
  // Logic
  {
    type: 'ifElse',
    category: 'logic',
    label: 'If / Else',
    icon: 'git-branch',
    color: 'bg-orange-500',
    description: 'Create conditions to branch workflows',
  },
  {
    type: 'while',
    category: 'logic',
    label: 'While',
    icon: 'rotate-ccw',
    color: 'bg-orange-500',
    description: 'Loop until condition is true',
  },
  {
    type: 'userApproval',
    category: 'logic',
    label: 'User Approval',
    icon: 'user-check',
    color: 'bg-orange-500',
    description: 'Add human-in-the-loop approval',
  },
  // Data
  {
    type: 'transform',
    category: 'data',
    label: 'Transform',
    icon: 'arrow-right-left',
    color: 'bg-purple-500',
    description: 'Reshape data using CEL expressions',
  },
  {
    type: 'setState',
    category: 'data',
    label: 'Set State',
    icon: 'circle-dot',
    color: 'bg-purple-500',
    description: 'Set global variables accessible throughout workflow',
  },
]

const categories: { id: NodeCategory; label: string }[] = [
  { id: 'core', label: 'Core' },
  { id: 'tools', label: 'Tools' },
  { id: 'logic', label: 'Logic' },
  { id: 'data', label: 'Data' },
]

const iconMap: Record<string, any> = {
  play: Play,
  square: Square,
  'file-text': FileText,
  'folder-search': FolderSearch,
  shield: Shield,
  plug: Plug,
  'git-branch': GitBranch,
  'rotate-ccw': RotateCcw,
  'user-check': UserCheck,
  'arrow-right-left': ArrowRightLeft,
  'circle-dot': CircleDot,
  list: List,
}

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<NodeCategory>>(
    new Set<NodeCategory>(['core', 'tools', 'logic', 'data'] as NodeCategory[])
  )

  const filteredNodes = nodeDefinitions.filter((node) =>
    node.type !== 'start' && node.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleCategory = (category: NodeCategory) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-full h-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex flex-col shadow-2xl overflow-hidden m-2">
      <div className="p-3 border-b border-[#2a2a2a]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Q Insert node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-4">
          {categories.map((category) => {
            const categoryNodes = filteredNodes.filter((node) => node.category === category.id)
            const isExpanded = expandedCategories.has(category.id)

            if (categoryNodes.length === 0) return null

            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-[#9ca3af] hover:text-white transition-colors uppercase tracking-wider"
                >
                  <span>{category.label}</span>
                  <span className="text-[#6b7280]">{isExpanded ? '−' : '+'}</span>
                </button>
                {isExpanded && (
                  <div className="mt-1.5 space-y-1">
                    {categoryNodes.map((node) => {
                      const Icon = iconMap[node.icon] || Play
                      return (
                        <div
                          key={node.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, node.type)}
                          onClick={() => onAddNode(node.type, { x: 250, y: 250 })}
                          className="node-palette-item flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-[#2a2a2a] cursor-move transition-all group hover:translate-x-1"
                        >
                          <div className={`w-7 h-7 rounded-md ${node.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white">{node.label}</div>
                            <div className="text-xs text-[#6b7280] truncate leading-tight">{node.description}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
