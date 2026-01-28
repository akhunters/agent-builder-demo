'use client'

import { useState } from 'react'
import { ChevronDown, Check, Plus, FileText, Brackets, Braces, Trash2 } from 'lucide-react'
import { SetStateNodeData, StartNodeStateVariable } from '@/types'
import VariableFormPopup from './VariableFormPopup'
import Menu from './Menu'
import { Node } from '@xyflow/react'

interface SetStateConfigFormProps {
  data: SetStateNodeData
  nodeId?: string
  nodes: Node[]
  onChange: (data: Partial<SetStateNodeData>) => void
  onUpdateStartNode?: (nodeId: string, data: any) => void
}

const getStateVariableIcon = (type?: 'string' | 'number' | 'boolean' | 'object' | 'list') => {
  switch (type) {
    case 'string':
      return <FileText className="w-4 h-4 text-[#10b981]" />
    case 'number':
      return (
        <div className="w-4 h-4 rounded bg-[#3b82f6] flex items-center justify-center">
          <span className="text-white text-xs font-bold">N</span>
        </div>
      )
    case 'boolean':
      return (
        <div className="w-4 h-4 rounded bg-[#f97316] flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
        </div>
      )
    case 'list':
      return <Brackets className="w-4 h-4 text-[#a855f7]" />
    case 'object':
      return <Braces className="w-4 h-4 text-[#8b5cf6]" />
    default:
      return <FileText className="w-4 h-4 text-[#10b981]" />
  }
}

const getVariablePath = (variable: StartNodeStateVariable, path: string[] = []): Array<{ variable: StartNodeStateVariable; path: string[] }> => {
  const result: Array<{ variable: StartNodeStateVariable; path: string[] }> = []

  if (variable.type === 'object' && variable.schema?.properties) {
    // Add nested properties
    Object.entries(variable.schema.properties).forEach(([propName, propDef]: [string, any]) => {
      const nestedPath = [...path, propName]
      const propType = propDef.type === 'string' ? 'string'
        : propDef.type === 'number' || propDef.type === 'integer' ? 'number'
          : propDef.type === 'boolean' ? 'boolean'
            : propDef.type === 'array' ? 'list'
              : 'object'

      const nestedVar: StartNodeStateVariable = {
        name: propName,
        type: propType,
        schema: propDef.type === 'object' && propDef.properties
          ? { type: 'object', properties: propDef.properties || {}, additionalProperties: false, required: propDef.required || [] }
          : undefined,
      }
      result.push({ variable: nestedVar, path: nestedPath })

      // Recursively get nested object properties
      if (propDef.type === 'object' && propDef.properties) {
        result.push(...getVariablePath(nestedVar, nestedPath))
      }
    })
  }

  return result
}

export default function SetStateConfigForm({ data, nodeId = '', nodes, onChange, onUpdateStartNode }: SetStateConfigFormProps) {
  const [showAddVariableForm, setShowAddVariableForm] = useState(false)
  const [newVariable, setNewVariable] = useState<StartNodeStateVariable | null>(null)

  // Find start node
  const startNode = nodes.find(n => n.type === 'start')
  const startNodeData = startNode?.data as any
  const stateVariables = startNodeData?.stateVariables || []

  // Build flat list of variables including nested properties
  const allVariables: Array<{ variable: StartNodeStateVariable; path: string[]; displayName: string }> = []

  stateVariables.forEach((varItem: StartNodeStateVariable) => {
    // Add the variable itself
    allVariables.push({
      variable: varItem,
      path: [varItem.name],
      displayName: varItem.name,
    })

    // Add nested properties if it's an object
    if (varItem.type === 'object' && varItem.schema?.properties) {
      const nested = getVariablePath(varItem, [varItem.name])
      nested.forEach(({ variable, path }) => {
        allVariables.push({
          variable,
          path,
          displayName: path.join('.'),
        })
      })
    }
  })

  // If no variables exist, show default string input
  const hasVariables = allVariables.length > 0

  // Find selected variable
  const selectedVariable = allVariables.find(v => {
    if (data.variableName) {
      return v.path.join('.') === data.variableName || v.variable.name === data.variableName
    }
    return false
  })

  const getVariableTypeLabel = (type?: string): string => {
    const typeMap: Record<string, string> = {
      string: 'STRING',
      number: 'NUM',
      boolean: 'BOOLEAN',
      object: 'OBJECT',
      list: 'ARRAY',
    }
    return typeMap[type || 'string'] || 'STRING'
  }

  const handleVariableSelect = (variable: StartNodeStateVariable, path: string[]) => {
    const variablePath = path.join('.')
    onChange({ variableName: variablePath })
  }

  const handleAddVariable = (variable: StartNodeStateVariable) => {
    if (!startNode || !onUpdateStartNode) return

    // Add variable to start node's stateVariables
    const currentStateVars = startNodeData?.stateVariables || []
    const updatedStateVars = [...currentStateVars, variable]

    onUpdateStartNode(startNode.id, {
      ...startNodeData,
      stateVariables: updatedStateVars,
    })

    // Select the newly added variable
    onChange({ variableName: variable.name })
    setShowAddVariableForm(false)
    setNewVariable(null)
  }

  return (
    <div className="space-y-6">
      {/* Assign value */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-white">Assign value</label>
          {data.value && (
            <button
              onClick={() => onChange({ value: '' })}
              className="p-1 hover:bg-white/5 rounded text-[#6b7280] hover:text-white transition-colors"
              type="button"
              title="Clear value"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <textarea
          value={data.value || ''}
          onChange={(e) => onChange({ value: e.target.value })}
          rows={3}
          className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
          placeholder="input.foo + 1"
        />
        <div className="text-xs text-[#9ca3af] mt-2">
          Use Common Expression Language to create a custom expression.
        </div>
      </div>

      {/* To variable */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">To variable</label>
        <Menu
          align="left"
          side="bottom"
          trigger={
            <button
              className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors flex items-center justify-between"
              type="button"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedVariable ? (
                  <>
                    {getStateVariableIcon(selectedVariable.variable.type)}
                    <span className="truncate">{selectedVariable.displayName}</span>
                  </>
                ) : hasVariables ? (
                  <span className="text-[#6b7280]">Select a variable</span>
                ) : (
                  <span className="text-[#6b7280]">No variables available</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedVariable && (
                  <span className="text-xs text-[#9ca3af] uppercase">
                    {getVariableTypeLabel(selectedVariable.variable.type)}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-[#6b7280]" />
              </div>
            </button>
          }
        >
          <div className="bg-[#173153] border border-white/15 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-[300px]">
            {hasVariables ? (
              <>
                {allVariables.map((item, index) => {
                  const isSelected = selectedVariable?.path.join('.') === item.path.join('.')
                  return (
                    <button
                      key={index}
                      onClick={() => handleVariableSelect(item.variable, item.path)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#072448] transition-colors ${isSelected ? 'bg-[#072448]' : ''
                        }`}
                      type="button"
                    >
                      <div className="flex-shrink-0">
                        {getStateVariableIcon(item.variable.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-white truncate">{item.displayName}</span>
                          <span className="text-xs text-[#9ca3af] uppercase flex-shrink-0">
                            {getVariableTypeLabel(item.variable.type)}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#3b82f6] flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
                <div className="border-t border-white/15">
                  <button
                    onClick={() => {
                      setNewVariable({ name: '', type: 'string', defaultValue: undefined })
                      setShowAddVariableForm(true)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#072448] transition-colors text-sm text-white"
                    type="button"
                    data-variable-form-trigger
                  >
                    <Plus className="w-4 h-4 text-[#3b82f6]" />
                    <span>Add variable</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4">
                <div className="text-sm text-[#9ca3af] mb-3">No variables defined yet.</div>
                <button
                  onClick={() => {
                    setNewVariable({ name: '', type: 'string', defaultValue: undefined })
                    setShowAddVariableForm(true)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white transition-colors"
                  type="button"
                  data-variable-form-trigger
                >
                  <Plus className="w-4 h-4" />
                  <span>Add variable</span>
                </button>
              </div>
            )}
          </div>
        </Menu>
      </div>

      {/* Add Variable Form Popup */}
      <VariableFormPopup
        isOpen={showAddVariableForm}
        nodeId={nodeId}
        variable={newVariable}
        onSave={(variable) => {
          handleAddVariable(variable)
          setShowAddVariableForm(false)
          setNewVariable(null)
        }}
        onCancel={() => {
          setShowAddVariableForm(false)
          setNewVariable(null)
        }}
        existingVariables={stateVariables}
      />
    </div>
  )
}
