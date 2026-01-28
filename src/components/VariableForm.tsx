'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Edit2 } from 'lucide-react'
import { StartNodeStateVariable, JSONSchema } from '@/types'
import SchemaEditorModal from './SchemaEditorModal'

interface VariableFormProps {
  variable: StartNodeStateVariable | null
  onSave: (variable: StartNodeStateVariable) => void
  onCancel: () => void
  existingVariables?: StartNodeStateVariable[]
  onHeaderMouseDown?: (e: React.MouseEvent) => void
}

const sanitizeVariableName = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, '')
}

export default function VariableForm({ variable, onSave, onCancel, existingVariables = [], onHeaderMouseDown }: VariableFormProps) {
  const [name, setName] = useState(variable?.name || '')
  const [type, setType] = useState<'string' | 'number' | 'boolean' | 'object' | 'list'>(variable?.type || 'string')
  const [defaultValue, setDefaultValue] = useState<string | number | boolean | string[] | undefined>(variable?.defaultValue)
  const [listInputValue, setListInputValue] = useState<string>('')
  const [showSchemaModal, setShowSchemaModal] = useState(false)
  const [schema, setSchema] = useState<JSONSchema | undefined>(variable?.schema)

  useEffect(() => {
    if (variable) {
      setName(variable.name || '')
      setType(variable.type || 'string')
      setDefaultValue(variable.defaultValue)
      setSchema(variable.schema)
      if (variable.type === 'list' && Array.isArray(variable.defaultValue)) {
        setListInputValue(variable.defaultValue.join(', '))
      } else {
        setListInputValue('')
      }
    } else {
      // New variable - initialize with defaults
      setName('')
      setType('string')
      setDefaultValue(undefined)
      setSchema(undefined)
      setListInputValue('')
    }
  }, [variable])

  const handleSave = () => {
    if (!name.trim()) return

    // Validate object type has schema with properties
    const hasSchema = schema !== undefined
    const hasProperties = hasSchema && schema?.properties && Object.keys(schema.properties).length > 0
    
    if (type === 'object' && !hasProperties) {
      return
    }

    // Process default value based on type
    let processedDefaultValue: string | number | boolean | string[] | undefined = defaultValue
    if (type === 'boolean') {
      processedDefaultValue = defaultValue === true || defaultValue === 'true'
    } else if (type === 'number') {
      processedDefaultValue = defaultValue === '' || defaultValue === undefined 
        ? undefined 
        : Number(defaultValue)
    } else if (type === 'list') {
      processedDefaultValue = Array.isArray(defaultValue) && defaultValue.length > 0
        ? defaultValue
        : undefined
    } else if (type === 'string') {
      processedDefaultValue = defaultValue === '' ? undefined : String(defaultValue)
    }

    const newVariable: StartNodeStateVariable = {
      name: name.trim(),
      type,
      defaultValue: processedDefaultValue,
      schema: type === 'object' ? schema : undefined,
    }

    onSave(newVariable)
  }


  return (
    <div className="bg-[#072448] border border-white/15 rounded-lg p-4 space-y-4">
      <div 
        className="flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onHeaderMouseDown}
        style={{ userSelect: 'none' }}
      >
        <h4 className="text-sm font-semibold text-white">
          {variable ? 'Edit variable' : 'Add variable'}
        </h4>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-white/5 rounded text-[#6b7280] hover:text-white transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Type tabs */}
      <div className="inline-flex rounded-lg bg-[#072448] border border-white/15 text-xs font-medium overflow-hidden">
        {(['string', 'number', 'boolean', 'object', 'list'] as const).map((typeOption, index) => (
          <button
            key={typeOption}
            onClick={() => {
              setType(typeOption)
              if (typeOption === 'list') {
                setListInputValue('')
              }
              // Clear schema if switching away from object
              if (typeOption !== 'object') {
                setSchema(undefined)
              }
            }}
            className={`px-3 py-1.5 transition-colors ${
              index > 0 ? 'border-l border-white/15' : ''
            } ${
              type === typeOption
                ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/5'
            }`}
          >
            {typeOption === 'list' ? 'List' : typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Name & default value */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-white">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const sanitized = sanitizeVariableName(e.target.value)
              setName(sanitized)
            }}
            placeholder="Enter the variable name"
            className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
          />
        </div>
        {type !== 'object' && (
          <div>
            <label className="block text-xs font-medium mb-1.5 text-white">
              Default value <span className="text-[#6b7280]">Optional</span>
            </label>
            {type === 'boolean' ? (
              <select
                value={defaultValue === true || defaultValue === 'true' ? 'true' : 'false'}
                onChange={(e) => setDefaultValue(e.target.value === 'true')}
                className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : type === 'number' ? (
              <input
                type="text"
                inputMode="numeric"
                value={defaultValue === '' || defaultValue === undefined 
                  ? '' 
                  : String(defaultValue)}
                onChange={(e) => {
                  const value = e.target.value
                  const sanitized = value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/^-?/, (match) => value.startsWith('-') ? '-' : '')
                  if (sanitized === '' || sanitized === '-') {
                    setDefaultValue(undefined)
                  } else {
                    const numValue = Number(sanitized)
                    if (!isNaN(numValue)) {
                      setDefaultValue(numValue)
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault()
                  }
                }}
                placeholder="0"
                className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              />
            ) : type === 'list' ? (
              <div>
                <input
                  type="text"
                  value={listInputValue}
                  onChange={(e) => setListInputValue(e.target.value)}
                  onBlur={() => {
                    const arrayValue = listInputValue === '' 
                      ? [] 
                      : listInputValue.split(',').map(item => item.trim()).filter(item => item !== '')
                    setDefaultValue(arrayValue)
                  }}
                  placeholder="item1, item2, item3"
                  className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
                <p className="text-xs text-[#6b7280] mt-1">Enter comma-separated values</p>
              </div>
            ) : (
              <input
                type="text"
                value={defaultValue !== undefined ? String(defaultValue) : ''}
                onChange={(e) => setDefaultValue(e.target.value)}
                placeholder="Default value"
                className="w-full bg-[#173153] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              />
            )}
          </div>
        )}
        {type === 'object' && (
          <div>
            <label className="block text-xs font-medium mb-1.5 text-white">Schema</label>
            <button
              onClick={() => setShowSchemaModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-white text-sm transition-colors"
              type="button"
            >
              {variable?.schema ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit schema</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add schema</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {type === 'object' && !variable?.schema && (
        <div className="bg-[#fef3c7] border border-[#fbbf24] rounded-md px-3 py-2 text-sm text-[#92400e]">
          <p>Object type requires at least one property in the schema. Please add a schema with at least one property.</p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={type === 'object' && !schema}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            type === 'object' && !schema
              ? 'bg-[#072448] text-[#6b7280] cursor-not-allowed opacity-50'
              : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
          }`}
          type="button"
        >
          Save
        </button>
      </div>

      <SchemaEditorModal
        isOpen={showSchemaModal}
        initialSchema={schema}
        onClose={() => setShowSchemaModal(false)}
        onSave={(newSchema) => {
          setSchema(newSchema)
          // Ensure type is set to object when schema is added
          if (type !== 'object') {
            setType('object')
          }
          setShowSchemaModal(false)
        }}
      />
    </div>
  )
}
