'use client'

import { useState, useEffect, useRef } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { TransformNodeData, JSONSchema } from '@/types'
import SchemaEditorModal from './SchemaEditorModal'

interface TransformExpression {
  key: string
  value: string
}

interface TransformConfigFormProps {
  data: TransformNodeData
  nodeId?: string
  onChange: (data: Partial<TransformNodeData>) => void
  onDelete?: () => void
}

export default function TransformConfigForm({ data, nodeId, onChange, onDelete }: TransformConfigFormProps) {
  const nodeIdRef = useRef<string | undefined>(nodeId)
  const lastDataRef = useRef<string>('')
  
  const getInitialMode = (): 'expressions' | 'object' => {
    if (data.mode) return data.mode
    if (data.expressions) return 'expressions'
    if (data.schema) return 'object'
    return 'expressions'
  }

  const getInitialExpressions = (): TransformExpression[] => {
    if (data.expressions) return data.expressions
    if (data.expression) return [{ key: '', value: data.expression }]
    return []
  }

  const [mode, setMode] = useState<'expressions' | 'object'>(getInitialMode())
  const [expressions, setExpressions] = useState<TransformExpression[]>(getInitialExpressions())
  const [schema, setSchema] = useState<JSONSchema | undefined>(data.schema)
  const [showSchemaModal, setShowSchemaModal] = useState(false)

  // Sync when node changes or when data prop changes (node reselected)
  useEffect(() => {
    const currentDataStr = JSON.stringify({
      nodeId,
      mode: data.mode,
      schema: data.schema,
      expressions: data.expressions,
      expression: data.expression,
    })
    
    // Only sync if data actually changed
    if (currentDataStr !== lastDataRef.current) {
      lastDataRef.current = currentDataStr
      
      const isNodeChange = nodeId && nodeIdRef.current !== nodeId
      if (isNodeChange) {
        nodeIdRef.current = nodeId
      }
      
      // Always sync schema from data if it exists - this ensures schema persists when node is reselected
      if (data.schema !== undefined && data.schema !== null) {
        setSchema(data.schema)
      } else if (isNodeChange && data.schema === undefined) {
        // Only clear schema if node changed and data explicitly has no schema
        setSchema(undefined)
      }
      // If not a node change and data.schema is undefined, keep current schema (preserve user's work)
      
      // Sync mode from data
      const newMode = data.mode || (data.expressions ? 'expressions' : data.schema ? 'object' : 'expressions')
      setMode(newMode)
      
      // Sync expressions from data
      if (data.expressions && data.expressions.length > 0) {
        setExpressions(data.expressions)
      } else if (data.expression) {
        setExpressions([{ key: '', value: data.expression }])
      } else if (isNodeChange) {
        // Only reset to empty on node change
        setExpressions([])
      }
    }
  }, [nodeId, data.mode, data.schema, data.expressions, data.expression])

  const handleModeChange = (newMode: 'expressions' | 'object') => {
    setMode(newMode)
    // Preserve state when switching modes - keep both expressions and schema in data
    if (newMode === 'expressions') {
      // When switching to expressions, keep schema in data but set mode to expressions
      onChange({ 
        mode: 'expressions', 
        expressions: expressions.length > 0 ? expressions : undefined,
        schema: schema // Preserve schema even in expressions mode
      })
    } else {
      // When switching to object, save the schema and clear expressions
      onChange({ mode: 'object', expressions: undefined, schema: schema })
    }
  }

  const handleExpressionChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...expressions]
    
    // Validate key: only lowercase alphanumeric and underscores, no spaces
    if (field === 'key') {
      // Remove spaces and convert to lowercase, then filter to only allow alphanumeric and underscores
      const sanitized = value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '')
      updated[index] = { ...updated[index], [field]: sanitized }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    
    setExpressions(updated)
    // Only save non-empty expressions, preserve schema
    const validExpressions = updated.filter(expr => expr.key.trim() || expr.value.trim())
    onChange({ 
      mode: 'expressions', 
      expressions: validExpressions.length > 0 ? validExpressions : undefined,
      schema: schema // Preserve schema
    })
  }

  const handleRemoveExpression = (index: number) => {
    const updated = expressions.filter((_, i) => i !== index)
    setExpressions(updated)
    // Allow empty expressions array - user can add new ones, preserve schema
    onChange({ 
      mode: 'expressions', 
      expressions: updated.length > 0 ? updated : undefined,
      schema: schema // Preserve schema
    })
  }

  const handleAddExpression = () => {
    const updated = [...expressions, { key: '', value: '' }]
    setExpressions(updated)
  }

  const handleSchemaSave = (newSchema: JSONSchema) => {
    setSchema(newSchema)
    onChange({ mode: 'object', schema: newSchema, expressions: undefined })
    setShowSchemaModal(false)
  }

  return (
    <div className="space-y-6">

      {/* Name Input */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-white whitespace-nowrap">Name</label>
        <input
          type="text"
          value={data.label || 'Transform'}
          onChange={(e) => onChange({ label: e.target.value })}
          className="flex-1 bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
          placeholder="Transform"
        />
      </div>

      {/* Mode Tabs */}
      <div className="inline-flex rounded-lg bg-[#072448] border border-white/15 text-xs font-medium overflow-hidden">
        <button
          onClick={() => handleModeChange('expressions')}
          className={`px-4 py-2 transition-colors ${
            mode === 'expressions'
              ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/5'
          }`}
        >
          Expressions
        </button>
        <button
          onClick={() => handleModeChange('object')}
          className={`px-4 py-2 transition-colors border-l border-white/15 ${
            mode === 'object'
              ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/5'
          }`}
        >
          Object
        </button>
      </div>

      {/* Expressions Mode */}
      {mode === 'expressions' && (
        <div className="space-y-4">
          {expressions.length > 0 ? (
            <>
              {expressions.map((expr, index) => (
                <div key={index} className="space-y-3 p-4 bg-[#072448] border border-white/15 rounded-lg">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Key</label>
                    <button
                      onClick={() => handleRemoveExpression(index)}
                      className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-[#9ca3af] hover:text-white"
                      type="button"
                      title="Remove expression"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={expr.key}
                    onChange={(e) => handleExpressionChange(index, 'key', e.target.value)}
                    className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                    placeholder="Enter key"
                    pattern="[a-z0-9_]+"
                  />
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Value</label>
                    <textarea
                      value={expr.value}
                      onChange={(e) => handleExpressionChange(index, 'value', e.target.value)}
                      rows={3}
                      className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
                      placeholder="input.foo + 1"
                    />
                  </div>
                  {index === expressions.length - 1 && (
                    <div className="text-xs text-[#9ca3af] mt-2">
                      Use Common Expression Language to create a custom expression.
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddExpression}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </>
          ) : (
            <button
              onClick={handleAddExpression}
              className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      )}

      {/* Object Mode */}
      {mode === 'object' && (
        <div className="space-y-4">
          {schema ? (
            <div className="p-4 bg-[#072448] border border-white/15 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Schema</span>
                <button
                  onClick={() => setShowSchemaModal(true)}
                  className="text-sm text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                  type="button"
                >
                  Edit
                </button>
              </div>
              <pre className="text-xs text-[#9ca3af] font-mono overflow-auto max-h-40">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </div>
          ) : (
            <button
              onClick={() => setShowSchemaModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add schema
            </button>
          )}
        </div>
      )}

      {/* Schema Editor Modal */}
      <SchemaEditorModal
        isOpen={showSchemaModal}
        initialSchema={schema}
        onClose={() => setShowSchemaModal(false)}
        onSave={handleSchemaSave}
      />
    </div>
  )
}
