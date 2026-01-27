'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Info } from 'lucide-react'

interface FunctionConfig {
  definition: string
  strict?: boolean
}

interface FunctionConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: FunctionConfig) => void
  initialConfig?: FunctionConfig
}

const EXAMPLE_FUNCTIONS = [
  {
    name: 'get_stock_price',
    definition: JSON.stringify({
      name: 'get_stock_price',
      description: 'Get the current stock price',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The stock symbol'
          }
        },
        additionalProperties: false,
        required: ['symbol']
      }
    }, null, 2)
  },
  {
    name: 'send_email',
    definition: JSON.stringify({
      name: 'send_email',
      description: 'Send an email to a recipient',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'Recipient email address'
          },
          subject: {
            type: 'string',
            description: 'Email subject'
          },
          body: {
            type: 'string',
            description: 'Email body content'
          }
        },
        additionalProperties: false,
        required: ['to', 'subject', 'body']
      }
    }, null, 2)
  },
  {
    name: 'get_weather',
    definition: JSON.stringify({
      name: 'get_weather',
      description: 'Get current weather information',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name or location'
          },
          units: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature units'
          }
        },
        additionalProperties: false,
        required: ['location']
      }
    }, null, 2)
  }
]

export default function FunctionConfigModal({ isOpen, onClose, onSave, initialConfig }: FunctionConfigModalProps) {
  const [definition, setDefinition] = useState('')
  const [strict, setStrict] = useState(false)
  const [showExamples, setShowExamples] = useState(false)

  useEffect(() => {
    if (isOpen && initialConfig) {
      setDefinition(initialConfig.definition || '')
      setStrict(initialConfig.strict ?? false)
    } else if (isOpen) {
      // Default example function
      setDefinition(EXAMPLE_FUNCTIONS[0].definition)
      setStrict(false)
    }
  }, [isOpen, initialConfig])

  const handleExampleSelect = (example: typeof EXAMPLE_FUNCTIONS[0]) => {
    setDefinition(example.definition)
    setShowExamples(false)
  }

  const handleSave = () => {
    try {
      // Validate JSON
      JSON.parse(definition)
      onSave({ definition, strict })
      onClose()
    } catch (error) {
      alert('Invalid JSON. Please check your function definition.')
    }
  }

  const handleAddStrict = () => {
    try {
      const parsed = JSON.parse(definition)
      const updated = { ...parsed, strict: true }
      setDefinition(JSON.stringify(updated, null, 2))
    } catch (error) {
      // If JSON is invalid, just append it
      const lines = definition.split('\n')
      const lastBraceIndex = lines.findIndex((line, index) => 
        line.trim() === '}' && index === lines.length - 1
      )
      if (lastBraceIndex !== -1) {
        lines.splice(lastBraceIndex, 0, '  "strict": true,')
        setDefinition(lines.join('\n'))
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-white">Function</h2>
          <p className="text-sm text-[#9ca3af] mt-1">
            The model will intelligently decide to call functions based on input it receives from the user.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Definition Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-white">Definition</label>
              <div className="relative">
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors flex items-center gap-2"
                  >
                    Examples
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showExamples && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowExamples(false)}
                      />
                      <div className="absolute right-0 mt-1 z-20 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg overflow-hidden">
                        {EXAMPLE_FUNCTIONS.map((example) => (
                          <button
                            key={example.name}
                            onClick={() => handleExampleSelect(example)}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                          >
                            {example.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
            </div>

            {/* JSON Editor */}
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder='{\n  "name": "function_name",\n  "description": "Function description",\n  "parameters": {}\n}'
              rows={15}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm font-mono placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
            />

            {/* Info Bar */}
            <div className="mt-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md px-3 py-2 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#6b7280] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-[#9ca3af]">
                Add{' '}
                <button
                  onClick={handleAddStrict}
                  className="text-[#3b82f6] hover:text-[#60a5fa] underline font-mono"
                >
                  "strict": true
                </button>
                {' '}to ensure the model's response always follows this schema.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a2a2a] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-md text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}