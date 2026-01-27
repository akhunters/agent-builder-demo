'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, ChevronDown, Search } from 'lucide-react'

interface HallucinationConfig {
  vectorStoreId: string
  model: string
  confidenceThreshold: number
}

interface HallucinationConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: HallucinationConfig) => void
  initialConfig?: HallucinationConfig
}

const MODELS = [
  'gpt-4.1-mini',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
]

export default function HallucinationConfigModal({ isOpen, onClose, onSave, initialConfig }: HallucinationConfigModalProps) {
  const [vectorStoreId, setVectorStoreId] = useState('')
  const [model, setModel] = useState('gpt-4.1-mini')
  const [confidenceThreshold, setConfidenceThreshold] = useState(70)
  const [showModelDropdown, setShowModelDropdown] = useState(false)

  useEffect(() => {
    if (isOpen && initialConfig) {
      setVectorStoreId(initialConfig.vectorStoreId || '')
      setModel(initialConfig.model || 'gpt-4.1-mini')
      setConfidenceThreshold(initialConfig.confidenceThreshold || 70)
    } else if (isOpen) {
      setVectorStoreId('')
      setModel('gpt-4.1-mini')
      setConfidenceThreshold(70)
    }
  }, [isOpen, initialConfig])

  const handleSave = () => {
    onSave({ vectorStoreId, model, confidenceThreshold })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-semibold text-white">Hallucination guardrail</h2>
          <p className="text-sm text-[#9ca3af] mt-1">
            Detect and flag hallucinations by verifying claims against trusted documents in your vector store.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Vector Store */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Vector store</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <input
                type="text"
                value={vectorStoreId}
                onChange={(e) => setVectorStoreId(e.target.value)}
                placeholder="Enter vector store id"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md pl-9 pr-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              />
            </div>
            <a
              href="#"
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors flex items-center gap-1 mt-2"
            >
              Browse vector stores
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Model</label>
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm flex items-center justify-between hover:border-[#3a3a3a] transition-colors"
              >
                <span>{model}</span>
                <ChevronDown className="w-4 h-4 text-[#6b7280]" />
              </button>
              {showModelDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowModelDropdown(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {MODELS.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setModel(m)
                          setShowModelDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Confidence Threshold */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-white">Confidence threshold</label>
              <span className="text-sm text-white">{confidenceThreshold} %</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${confidenceThreshold}%, #2a2a2a ${confidenceThreshold}%, #2a2a2a 100%)`
              }}
            />
            <p className="text-xs text-[#9ca3af] mt-1">
              Minimum confidence score to trigger tripwire for the guardrail.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a2a2a] flex items-center justify-between">
          <a
            href="https://docs.composio.dev/guardrails/hallucination"
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
              className="px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-md text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}