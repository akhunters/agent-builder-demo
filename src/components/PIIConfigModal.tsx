'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface PIIConfig {
  action: 'mask' | 'block'
  selectedEntities: Set<string>
}

interface PIIConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: PIIConfig) => void
  initialConfig?: PIIConfig
}

const COMMON_ENTITIES = [
  'Person name',
  'Phone number',
  'Email address',
  'Location',
  'Date or time',
  'IP address',
  'URL',
  'Credit card number',
  'International bank account number (IBAN)',
  'Cryptocurrency wallet address',
  'Nationality / religion / political group',
  'Medical license number',
]

const USA_ENTITIES = [
  'US federal tax ID',
  "US driver's license number",
  'US passport number',
  'US social security number',
  'US bank account number',
  'US credit card number',
  'US phone number',
  'US email address',
]

const ALL_ENTITIES = [...COMMON_ENTITIES, ...USA_ENTITIES]

export default function PIIConfigModal({ isOpen, onClose, onSave, initialConfig }: PIIConfigModalProps) {
  const [action, setAction] = useState<'mask' | 'block'>('mask')
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(new Set())
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && initialConfig) {
      setAction(initialConfig.action)
      setSelectedEntities(new Set(initialConfig.selectedEntities))
    } else if (isOpen) {
      // Default: mask action, no entities selected
      setAction('mask')
      setSelectedEntities(new Set())
    }
  }, [isOpen, initialConfig])

  const allSelected = selectedEntities.size === ALL_ENTITIES.length
  const someSelected = selectedEntities.size > 0 && selectedEntities.size < ALL_ENTITIES.length

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  const handleSelectAll = () => {
    setSelectedEntities(new Set(ALL_ENTITIES))
  }

  const handleClear = () => {
    setSelectedEntities(new Set())
  }

  const handleToggleEntity = (entity: string) => {
    const newSet = new Set(selectedEntities)
    if (newSet.has(entity)) {
      newSet.delete(entity)
    } else {
      newSet.add(entity)
    }
    setSelectedEntities(newSet)
  }

  const handleSave = () => {
    onSave({ action, selectedEntities })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-white">Personally identifiable information (PII) guardrail</h2>
          <p className="text-sm text-[#9ca3af] mt-1">
            Detects sensitive personal data so you can block a request or mask the details before it reaches the model.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Action Toggles */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAction('mask')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                action === 'mask'
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#2a2a2a] text-[#9ca3af] hover:bg-[#3a3a3a]'
              }`}
            >
              Mask
            </button>
            <button
              onClick={() => setAction('block')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                action === 'block'
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#2a2a2a] text-[#9ca3af] hover:bg-[#3a3a3a]'
              }`}
            >
              Block
            </button>
          </div>

          {/* Select All / Clear */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                ref={selectAllCheckboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleSelectAll()
                  } else {
                    handleClear()
                  }
                }}
                className="w-4 h-4 rounded border-[#3a3a3a] bg-[#0a0a0a] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0"
              />
              <span className="text-sm text-white">Select all entities</span>
            </label>
            <button
              onClick={handleClear}
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Common Entities */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Common</h3>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_ENTITIES.map((entity) => (
                <label
                  key={entity}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEntities.has(entity)}
                    onChange={() => handleToggleEntity(entity)}
                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#0a0a0a] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-sm text-white">{entity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* USA Entities */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">USA</h3>
            <div className="grid grid-cols-2 gap-3">
              {USA_ENTITIES.map((entity) => (
                <label
                  key={entity}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEntities.has(entity)}
                    onChange={() => handleToggleEntity(entity)}
                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#0a0a0a] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-sm text-white">{entity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a2a2a] flex items-center justify-between">
          <a
            href="https://docs.composio.dev/guardrails/pii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors flex items-center gap-1"
          >
            Learn how it works
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-sm text-white font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}