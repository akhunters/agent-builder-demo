'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, FileText, Grid3x3, Brackets, Braces } from 'lucide-react'
import { JSONSchema } from '@/types'

interface SchemaEditorModalProps {
  isOpen: boolean
  initialSchema?: JSONSchema
  onClose: () => void
  onSave: (schema: JSONSchema) => void
}

export default function SchemaEditorModal({
  isOpen,
  initialSchema,
  onClose,
  onSave,
}: SchemaEditorModalProps) {
  const [schemaView, setSchemaView] = useState<'simple' | 'advanced'>('simple')
  const [schemaProperties, setSchemaProperties] = useState<Array<{
    name: string
    type: 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
    description: string
    default?: any
    required: boolean
    itemsType?: 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
    itemsDescription?: string
    itemsEnumValues?: string[]
    enumValues?: string[]
  }>>([])
  const [enumInputValues, setEnumInputValues] = useState<Record<number, string>>({})
  const [arrayItemEnumInputValues, setArrayItemEnumInputValues] = useState<Record<number, string>>({})
  const [schemaAdvancedJson, setSchemaAdvancedJson] = useState('')

  // Load initial schema when modal opens
  useEffect(() => {
    if (isOpen && initialSchema) {
      // Convert schema to properties array for Simple view
      const props = Object.entries(initialSchema.properties || {}).map(([name, def]: [string, any]) => {
        // Check if it's an enum type (has enum array)
        const hasEnum = def.enum && Array.isArray(def.enum) && def.enum.length > 0
        const shortType = mapJsonTypeToShort(def.type, hasEnum) as 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
        // Ensure default value is set based on type if not present
        let defaultValue = def.default
        if (defaultValue === undefined) {
          if (shortType === 'BOOL') defaultValue = true
          else if (shortType === 'NUM') defaultValue = 0
          else if (shortType === 'STR') defaultValue = ''
          else if (shortType === 'ARR') defaultValue = []
          else if (shortType === 'OBJ') defaultValue = {}
        }
        
        // Extract array items information
        let itemsType: 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR' | undefined = undefined
        let itemsDescription: string | undefined = undefined
        let itemsEnumValues: string[] | undefined = undefined
        if (shortType === 'ARR' && def.items) {
          const itemsHasEnum = def.items.enum && Array.isArray(def.items.enum) && def.items.enum.length > 0
          itemsType = mapJsonTypeToShort(def.items.type, itemsHasEnum) as 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
          itemsDescription = def.items.description || ''
          if (itemsHasEnum) {
            itemsEnumValues = def.items.enum.map((v: any) => String(v))
          }
        }
        
        // Extract enum values
        let enumValues: string[] | undefined = undefined
        if (shortType === 'ENUM' && def.enum && Array.isArray(def.enum)) {
          enumValues = def.enum.map((v: any) => String(v))
        }
        
        return {
          name,
          type: shortType,
          description: def.description || '',
          default: defaultValue,
          required: (initialSchema.required || []).includes(name),
          itemsType,
          itemsDescription,
          itemsEnumValues,
          enumValues,
        }
      })
      setSchemaProperties(props)
      setSchemaAdvancedJson(JSON.stringify(initialSchema, null, 2))
    } else if (isOpen && !initialSchema) {
      setSchemaProperties([])
      setSchemaAdvancedJson('')
    }
  }, [isOpen, initialSchema])

  // Update Advanced view in real-time when Simple view changes
  useEffect(() => {
    if (schemaView === 'simple' && isOpen) {
      const schema = generateSchemaFromProperties()
      setSchemaAdvancedJson(JSON.stringify(schema, null, 2))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaProperties, schemaView, isOpen])

  const sanitizeVariableName = (value: string): string => {
    // Only allow lowercase alphanumeric and underscores
    return value.toLowerCase().replace(/[^a-z0-9_]/g, '')
  }

  const mapJsonTypeToShort = (type: string, hasEnum?: boolean): string => {
    // If it has enum values, it's an ENUM type
    if (hasEnum) {
      return 'ENUM'
    }
    const map: Record<string, string> = {
      string: 'STR',
      number: 'NUM',
      boolean: 'BOOL',
      object: 'OBJ',
      array: 'ARR',
    }
    return map[type] || 'STR'
  }

  const mapShortTypeToJson = (type: string): string => {
    const map: Record<string, string> = {
      STR: 'string',
      NUM: 'number',
      BOOL: 'boolean',
      OBJ: 'object',
      ARR: 'array',
      ENUM: 'string', // ENUM is represented as string type with enum array
    }
    return map[type] || 'string'
  }

  const getDefaultValueForType = (type: 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR', currentDefault?: any): any => {
    if (currentDefault !== undefined && currentDefault !== '') {
      // Try to parse the default value based on type
      if (type === 'BOOL') {
        if (typeof currentDefault === 'boolean') return currentDefault
        if (currentDefault === 'true' || currentDefault === true) return true
        if (currentDefault === 'false' || currentDefault === false) return false
        return true // default for bool
      }
      if (type === 'NUM') {
        const num = typeof currentDefault === 'number' ? currentDefault : parseFloat(String(currentDefault))
        return isNaN(num) ? 0 : num
      }
      if (type === 'STR') {
        return String(currentDefault)
      }
      if (type === 'ARR') {
        try {
          return Array.isArray(currentDefault) ? currentDefault : JSON.parse(String(currentDefault))
        } catch {
          return []
        }
      }
      if (type === 'OBJ') {
        try {
          return typeof currentDefault === 'object' ? currentDefault : JSON.parse(String(currentDefault))
        } catch {
          return {}
        }
      }
      return currentDefault
    }
    
    // Set default values based on type
    switch (type) {
      case 'BOOL':
        return true
      case 'NUM':
        return 0
      case 'STR':
        return ''
      case 'ARR':
        return []
      case 'OBJ':
        return {}
      default:
        return ''
    }
  }

  const generateSchemaFromProperties = () => {
    const properties: Record<string, any> = {}
    const required: string[] = []

    schemaProperties.forEach((prop) => {
      if (prop.name.trim()) {
        const defaultValue = getDefaultValueForType(prop.type, prop.default)
        const propertyDef: any = {
          type: mapShortTypeToJson(prop.type),
        }
        
        if (prop.description && prop.description.trim()) {
          propertyDef.description = prop.description
        }
        
        // Always include default value
        propertyDef.default = defaultValue
        
        // For array types, add items definition
        if (prop.type === 'ARR' && prop.itemsType) {
          propertyDef.items = {
            type: mapShortTypeToJson(prop.itemsType),
          }
          if (prop.itemsDescription && prop.itemsDescription.trim()) {
            propertyDef.items.description = prop.itemsDescription
          }
          // For array items that are ENUM, add enum values
          if (prop.itemsType === 'ENUM' && prop.itemsEnumValues && prop.itemsEnumValues.length > 0) {
            propertyDef.items.type = 'string'
            propertyDef.items.enum = prop.itemsEnumValues
          }
        }
        
        // For enum types, add enum array
        if (prop.type === 'ENUM' && prop.enumValues && prop.enumValues.length > 0) {
          propertyDef.type = 'string'
          propertyDef.enum = prop.enumValues
        }
        
        properties[prop.name.trim()] = propertyDef
        
        if (prop.required) {
          required.push(prop.name.trim())
        }
      }
    })

    return {
      type: 'object',
      properties,
      additionalProperties: false,
      required,
    }
  }

  const getTypeIcon = (type: 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR') => {
    switch (type) {
      case 'STR':
        return <FileText className="w-4 h-4 text-[#10b981]" />
      case 'NUM':
        return (
          <div className="w-4 h-4 rounded bg-[#3b82f6] flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
        )
      case 'BOOL':
        return (
          <div className="w-4 h-4 rounded bg-[#f97316] flex items-center justify-center relative">
            <div className="w-2.5 h-2.5 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
          </div>
        )
      case 'ENUM':
        return <Grid3x3 className="w-4 h-4 text-[#fbbf24]" />
      case 'ARR':
        return <Brackets className="w-4 h-4 text-[#a855f7]" />
      case 'OBJ':
        return <Braces className="w-4 h-4 text-[#8b5cf6]" />
      default:
        return <FileText className="w-4 h-4 text-[#10b981]" />
    }
  }

  const handleSave = () => {
    let finalSchema
    if (schemaView === 'simple') {
      finalSchema = generateSchemaFromProperties()
    } else {
      try {
        finalSchema = JSON.parse(schemaAdvancedJson)
      } catch (e) {
        alert('Invalid JSON schema')
        return
      }
    }

    onSave(finalSchema)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Structured output (JSON)</h2>
              <p className="text-sm text-[#9ca3af]">The model will generate a JSON object that matches this schema.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg bg-[#111827] border border-[#2a2a2a] text-xs font-medium overflow-hidden">
                <button
                  onClick={() => setSchemaView('simple')}
                  className={`px-4 py-2 ${
                    schemaView === 'simple'
                      ? 'bg-white text-black'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
                  }`}
                >
                  Simple
                </button>
                <button
                  onClick={() => setSchemaView('advanced')}
                  className={`px-4 py-2 ${
                    schemaView === 'advanced'
                      ? 'bg-white text-black'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]'
                  }`}
                >
                  Advanced
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {schemaView === 'simple' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Properties</h3>
                <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 bg-[#0a0a0a] px-3 py-2 text-xs font-medium text-[#9ca3af] border-b border-[#2a2a2a]">
                    <div className="col-span-1"></div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-5">Description</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y divide-[#2a2a2a]">
                    {schemaProperties.map((prop, index) => (
                      <div key={index}>
                        <div className="grid grid-cols-12 gap-2 px-3 py-3 items-center">
                          <div className="col-span-1 flex items-center justify-center">
                            {getTypeIcon(prop.type)}
                          </div>
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={prop.name}
                              onChange={(e) => {
                                const sanitized = sanitizeVariableName(e.target.value)
                                const newProps = [...schemaProperties]
                                newProps[index].name = sanitized
                                setSchemaProperties(newProps)
                              }}
                              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                              placeholder="Property name"
                            />
                          </div>
                          <div className="col-span-2">
                            <select
                              value={prop.type}
                              onChange={(e) => {
                                const newProps = [...schemaProperties]
                                const newType = e.target.value as 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
                                newProps[index].type = newType
                                // Set default value based on type
                                if (newType === 'BOOL') {
                                  newProps[index].default = true
                                } else if (newType === 'NUM') {
                                  newProps[index].default = 0
                                } else if (newType === 'STR') {
                                  newProps[index].default = ''
                                } else if (newType === 'ARR') {
                                  newProps[index].default = []
                                  // Initialize array items type if not set
                                  if (!newProps[index].itemsType) {
                                    newProps[index].itemsType = 'STR'
                                  }
                                } else if (newType === 'OBJ') {
                                  newProps[index].default = {}
                                } else if (newType === 'ENUM') {
                                  // Initialize enum values array if not set
                                  if (!newProps[index].enumValues) {
                                    newProps[index].enumValues = []
                                  }
                                }
                                setSchemaProperties(newProps)
                              }}
                              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                            >
                              <option value="STR">STR</option>
                              <option value="NUM">NUM</option>
                              <option value="BOOL">BOOL</option>
                              <option value="ENUM">ENUM</option>
                              <option value="OBJ">OBJ</option>
                              <option value="ARR">ARR</option>
                            </select>
                          </div>
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={prop.description}
                              onChange={(e) => {
                                const newProps = [...schemaProperties]
                                newProps[index].description = e.target.value
                                setSchemaProperties(newProps)
                              }}
                              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                              placeholder="Add description"
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              onClick={() => {
                                const newProps = [...schemaProperties]
                                newProps.splice(index, 1)
                                setSchemaProperties(newProps)
                              }}
                              className="p-1 hover:bg-[#2a2a2a] rounded text-[#6b7280] hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* Nested Array Items Row */}
                        {prop.type === 'ARR' && (
                          <>
                            <div className="grid grid-cols-12 gap-2 px-3 py-3 items-center bg-[#0a0a0a]/50 pl-8">
                              <div className="col-span-1 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[#10b981]" />
                              </div>
                              <div className="col-span-3">
                                <span className="text-sm text-[#9ca3af]">Array items</span>
                              </div>
                              <div className="col-span-2">
                                <select
                                  value={prop.itemsType || 'STR'}
                                  onChange={(e) => {
                                    const newProps = [...schemaProperties]
                                    const newItemsType = e.target.value as 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
                                    newProps[index].itemsType = newItemsType
                                    // Initialize enum values if ENUM is selected
                                    if (newItemsType === 'ENUM' && !newProps[index].itemsEnumValues) {
                                      newProps[index].itemsEnumValues = []
                                    }
                                    setSchemaProperties(newProps)
                                  }}
                                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                                >
                                  <option value="STR">STR</option>
                                  <option value="NUM">NUM</option>
                                  <option value="BOOL">BOOL</option>
                                  <option value="ENUM">ENUM</option>
                                  <option value="OBJ">OBJ</option>
                                  <option value="ARR">ARR</option>
                                </select>
                              </div>
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  value={prop.itemsDescription || ''}
                                  onChange={(e) => {
                                    const newProps = [...schemaProperties]
                                    newProps[index].itemsDescription = e.target.value
                                    setSchemaProperties(newProps)
                                  }}
                                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                                  placeholder="Add description"
                                />
                              </div>
                              <div className="col-span-1">
                                {/* Empty space to align with parent row */}
                              </div>
                            </div>
                            {/* Nested Enum Values for Array Items */}
                            {prop.itemsType === 'ENUM' && (
                              <div className="px-3 py-3 bg-[#0a0a0a]/30 pl-12">
                                <div className="flex flex-wrap items-center gap-2 min-h-[32px] bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5">
                                  {(prop.itemsEnumValues || []).map((value, valueIndex) => (
                                    <div
                                      key={valueIndex}
                                      className="flex items-center gap-1.5 bg-[#2a2a2a] rounded-full px-2.5 py-1 text-sm text-white"
                                    >
                                      <span>{value}</span>
                                      <button
                                        onClick={() => {
                                          const newProps = [...schemaProperties]
                                          const newEnumValues = [...(newProps[index].itemsEnumValues || [])]
                                          newEnumValues.splice(valueIndex, 1)
                                          newProps[index].itemsEnumValues = newEnumValues.length > 0 ? newEnumValues : undefined
                                          setSchemaProperties(newProps)
                                        }}
                                        className="hover:bg-[#3a3a3a] rounded-full p-0.5 transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                  <input
                                    type="text"
                                    value={arrayItemEnumInputValues[index] || ''}
                                    onChange={(e) => {
                                      setArrayItemEnumInputValues((prev) => ({ ...prev, [index]: e.target.value }))
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault()
                                        const inputValue = arrayItemEnumInputValues[index]?.trim()
                                        if (inputValue) {
                                          const newProps = [...schemaProperties]
                                          const currentValues = newProps[index].itemsEnumValues || []
                                          if (!currentValues.includes(inputValue)) {
                                            newProps[index].itemsEnumValues = [...currentValues, inputValue]
                                            setSchemaProperties(newProps)
                                          }
                                          setArrayItemEnumInputValues((prev) => ({ ...prev, [index]: '' }))
                                        }
                                      }
                                    }}
                                    onBlur={() => {
                                      const inputValue = arrayItemEnumInputValues[index]?.trim()
                                      if (inputValue) {
                                        const newProps = [...schemaProperties]
                                        const currentValues = newProps[index].itemsEnumValues || []
                                        if (!currentValues.includes(inputValue)) {
                                          newProps[index].itemsEnumValues = [...currentValues, inputValue]
                                          setSchemaProperties(newProps)
                                        }
                                        setArrayItemEnumInputValues((prev) => ({ ...prev, [index]: '' }))
                                      }
                                    }}
                                    className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6b7280]"
                                    placeholder={(prop.itemsEnumValues || []).length === 0 ? "Enter enum values..." : ""}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {/* Nested Enum Values Row */}
                        {prop.type === 'ENUM' && (
                          <div className="px-3 py-3 bg-[#0a0a0a]/50 pl-8">
                            <div className="flex flex-wrap items-center gap-2 min-h-[32px] bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5">
                              {(prop.enumValues || []).map((value, valueIndex) => (
                                <div
                                  key={valueIndex}
                                  className="flex items-center gap-1.5 bg-[#2a2a2a] rounded-full px-2.5 py-1 text-sm text-white"
                                >
                                  <span>{value}</span>
                                  <button
                                    onClick={() => {
                                      const newProps = [...schemaProperties]
                                      const newEnumValues = [...(newProps[index].enumValues || [])]
                                      newEnumValues.splice(valueIndex, 1)
                                      newProps[index].enumValues = newEnumValues.length > 0 ? newEnumValues : undefined
                                      setSchemaProperties(newProps)
                                    }}
                                    className="hover:bg-[#3a3a3a] rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <input
                                type="text"
                                value={enumInputValues[index] || ''}
                                onChange={(e) => {
                                  setEnumInputValues((prev) => ({ ...prev, [index]: e.target.value }))
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault()
                                    const inputValue = enumInputValues[index]?.trim()
                                    if (inputValue) {
                                      const newProps = [...schemaProperties]
                                      const currentValues = newProps[index].enumValues || []
                                      if (!currentValues.includes(inputValue)) {
                                        newProps[index].enumValues = [...currentValues, inputValue]
                                        setSchemaProperties(newProps)
                                      }
                                      setEnumInputValues((prev) => ({ ...prev, [index]: '' }))
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  const inputValue = enumInputValues[index]?.trim()
                                  if (inputValue) {
                                    const newProps = [...schemaProperties]
                                    const currentValues = newProps[index].enumValues || []
                                    if (!currentValues.includes(inputValue)) {
                                      newProps[index].enumValues = [...currentValues, inputValue]
                                      setSchemaProperties(newProps)
                                    }
                                    setEnumInputValues((prev) => ({ ...prev, [index]: '' }))
                                  }
                                }}
                                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-white placeholder:text-[#6b7280]"
                                placeholder={(prop.enumValues || []).length === 0 ? "Enter enum values..." : ""}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSchemaProperties([...schemaProperties, {
                      name: '',
                      type: 'STR',
                      description: '',
                      default: '',
                      required: false,
                      itemsType: undefined,
                      itemsDescription: undefined,
                      enumValues: undefined,
                    }])
                  }}
                  className="mt-3 flex items-center gap-1 px-3 py-2 text-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add property</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <textarea
                value={schemaAdvancedJson}
                onChange={(e) => setSchemaAdvancedJson(e.target.value)}
                className="w-full h-96 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
                placeholder='{\n  "type": "object",\n  "properties": {},\n  "additionalProperties": false,\n  "required": []\n}'
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
