'use client'

import { useState } from 'react'
import React from 'react'
import { X, Trash2, ChevronUp, ChevronDown, List, Square, Play, Shield, FolderSearch, Plug, GitBranch, RotateCcw, ThumbsUp, ArrowRightLeft, CircleDot, FileText } from 'lucide-react'
import { Edge, Node } from '@xyflow/react'
import { ClassifyNodeData, EndNodeData, JSONSchema } from '@/types'

interface EdgeConfigPanelProps {
  edge: Edge
  sourceNode: Node | null
  targetNode: Node | null
  onDelete: (edgeId: string) => void
  onClose: () => void
}

// Helper function to get node icon based on type
const getNodeIcon = (nodeType: string) => {
  switch (nodeType) {
    case 'start':
      return (
        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0">
          <Play className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'agent':
      return (
        <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
          <Play className="w-3 h-3 text-white fill-white rotate-90" />
        </div>
      )
    case 'classify':
      return (
        <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
          <List className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'end':
      return (
        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0">
          <Square className="w-3 h-3 text-white stroke-2" />
        </div>
      )
    case 'note':
      return (
        <div className="w-5 h-5 rounded-full bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
          <FileText className="w-3 h-3 text-[#92400e]" />
        </div>
      )
    case 'fileSearch':
      return (
        <div className="w-5 h-5 rounded-full bg-[#eab308] flex items-center justify-center flex-shrink-0">
          <FolderSearch className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'guardrails':
      return (
        <div className="w-5 h-5 rounded-full bg-[#eab308] flex items-center justify-center flex-shrink-0">
          <Shield className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'mcp':
      return (
        <div className="w-5 h-5 rounded-full bg-[#eab308] flex items-center justify-center flex-shrink-0">
          <Plug className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'ifElse':
      return (
        <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'while':
      return (
        <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
          <RotateCcw className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'userApproval':
      return (
        <div className="w-5 h-5 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
          <ThumbsUp className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'transform':
      return (
        <div className="w-5 h-5 rounded-full bg-[#a855f7] flex items-center justify-center flex-shrink-0">
          <ArrowRightLeft className="w-3 h-3 text-white fill-white" />
        </div>
      )
    case 'setState':
      return (
        <div className="w-5 h-5 rounded-full bg-[#a855f7] flex items-center justify-center flex-shrink-0">
          <CircleDot className="w-3 h-3 text-white fill-white" />
        </div>
      )
    default:
      return (
        <div className="w-5 h-5 rounded-full bg-[#6b7280] flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>
      )
  }
}

// Helper function to generate schema from node data
const getNodeOutputSchema = (node: Node | null, sourceHandle?: string | null): JSONSchema | null => {
  if (!node) return null

  if (node.type === 'classify') {
    const data = node.data as ClassifyNodeData
    const categories = data.categories || []
    
    if (categories.length > 0) {
      // If sourceHandle is specified and matches a category, use that specific category
      // Otherwise, show all categories as enum values
      return {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: categories,
            description: undefined,
            default: undefined,
          },
        } as Record<string, any>,
        additionalProperties: false,
        required: ['category'],
      }
    }
  } else if (node.type === 'end') {
    // End node doesn't have output schema
    return null
  }

  // For other node types, return a basic schema or null
  return null
}

const getNodeInputSchema = (node: Node | null): JSONSchema | null => {
  if (!node) return null

  if (node.type === 'end') {
    const data = node.data as EndNodeData
    return data.schema || null
  }

  // For other node types, return null or a default schema
  return null
}

// Helper function to format schema for display
const formatSchemaForDisplay = (schema: JSONSchema | null): React.ReactNode => {
  if (!schema || !schema.properties) return <span className="text-[#6b7280]">No schema defined</span>

  return Object.entries(schema.properties).map(([name, def]: [string, any], index) => {
    const typeStr = def.type || 'unknown'
    const hasEnum = def.enum && Array.isArray(def.enum) && def.enum.length > 0
    
    return (
      <div key={name} className={index > 0 ? 'mt-2' : ''}>
        <div className="flex items-center gap-2">
          <span className="text-[#9ca3af]">{name}:</span>
          <span className="text-[#9ca3af]">{typeStr}</span>
        </div>
        {hasEnum && (
          <div className="mt-1 ml-4 text-[#9ca3af]">
            {def.enum.map((v: any, i: number) => (
              <span key={i}>
                {i > 0 && <span className="text-[#6b7280]"> | </span>}
                <span className="text-[#9ca3af]">"{v}"</span>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  })
}

export default function EdgeConfigPanel({
  edge,
  sourceNode,
  targetNode,
  onDelete,
  onClose,
}: EdgeConfigPanelProps) {
  const [showSourceSchema, setShowSourceSchema] = useState(true)
  const [showTargetSchema, setShowTargetSchema] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const sourceOutputSchema = getNodeOutputSchema(sourceNode, edge.sourceHandle)
  const targetInputSchema = getNodeInputSchema(targetNode)

  return (
    <div className="w-96 bg-[#173153] border border-white/15 flex flex-col shadow-2xl rounded-lg m-2 max-h-[calc(95vh-56px)] overflow-hidden scale-in">
      <div className="p-4 border-b border-white/15 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Edge</h3>
          <p className="text-xs text-[#9ca3af] mt-1">Inspect connection</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-[#9ca3af] hover:text-red-400"
            title="Delete edge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Source */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Source</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9ca3af]">{String(sourceNode?.data?.label || sourceNode?.type || 'Unknown')}</span>
            {getNodeIcon(sourceNode?.type || '')}
          </div>
        </div>

        {/* Target */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Target</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9ca3af]">{String(targetNode?.data?.label || targetNode?.type || 'Unknown')}</span>
            {getNodeIcon(targetNode?.type || '')}
          </div>
        </div>

        {/* Source Output Schema */}
        <div className="pt-2 border-t border-white/15">
          <button
            onClick={() => setShowSourceSchema(!showSourceSchema)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Source output schema</span>
              <span className="text-xs text-[#6b7280]">
                {sourceOutputSchema ? 'object' : 'none'}
              </span>
            </div>
            {showSourceSchema ? (
              <ChevronUp className="w-4 h-4 text-[#9ca3af]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
            )}
          </button>
          {showSourceSchema && (
            <div className="ml-4 mt-2">
              {sourceOutputSchema ? (
                <div className="text-xs bg-[#072448] p-2 rounded border border-white/15">
                  {formatSchemaForDisplay(sourceOutputSchema)}
                </div>
              ) : (
                <p className="text-xs text-[#6b7280]">No output schema defined</p>
              )}
            </div>
          )}
        </div>

        {/* Target Input Schema */}
        <div className="pt-2 border-t border-white/15">
          <button
            onClick={() => setShowTargetSchema(!showTargetSchema)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Target input schema</span>
              <span className="text-xs text-[#6b7280]">
                {targetInputSchema ? 'object' : 'none'}
              </span>
            </div>
            {showTargetSchema ? (
              <ChevronUp className="w-4 h-4 text-[#9ca3af]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#9ca3af]" />
            )}
          </button>
          {showTargetSchema && (
            <div className="ml-4 mt-2">
              {targetInputSchema ? (
                <div className="text-xs bg-[#072448] p-2 rounded border border-white/15">
                  {formatSchemaForDisplay(targetInputSchema)}
                </div>
              ) : (
                <p className="text-xs text-[#6b7280]">No input schema defined</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#173153] border border-white/15 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Edge?</h3>
            <p className="text-sm text-[#9ca3af] mb-4">
              Are you sure you want to delete this connection? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(edge.id)
                  setShowDeleteConfirm(false)
                  onClose()
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
