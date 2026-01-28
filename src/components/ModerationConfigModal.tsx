'use client'

import { useState, useEffect, useRef } from 'react'

interface ModerationConfig {
  selectedCategories: Set<string>
}

interface ModerationConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: ModerationConfig) => void
  initialConfig?: ModerationConfig
}

const MODERATION_CATEGORIES = {
  sexual: [
    { key: 'sexual', label: 'sexual', description: 'Sexually explicit or suggestive content.' },
    { key: 'sexual/minors', label: 'sexual/minors', description: 'Sexual content that includes individuals under the age of 18.' },
  ],
  hate: [
    { key: 'hate', label: 'hate', description: 'Hate speech and discriminatory content.' },
    { key: 'hate/threatening', label: 'hate/threatening', description: 'Hateful content that also includes violence or serious harm.' },
  ],
  harassment: [
    { key: 'harassment', label: 'harassment', description: 'Harassing or bullying content.' },
    { key: 'harassment/threatening', label: 'harassment/threatening', description: 'Harassment content that also includes violence or serious harm.' },
  ],
  selfHarm: [
    { key: 'self-harm', label: 'self-harm', description: 'Content that promotes, encourages, or depicts acts of self-harm.' },
    { key: 'self-harm/intent', label: 'self-harm/intent', description: 'Content expressing intent to commit self-harm.' },
    { key: 'self-harm/instructions', label: 'self-harm/instructions', description: 'Content providing instructions for self-harm.' },
  ],
  violence: [
    { key: 'violence', label: 'violence', description: 'Violent content or depictions of violence.' },
    { key: 'violence/graphic', label: 'violence/graphic', description: 'Graphic or extreme violent content.' },
  ],
}

const ALL_CATEGORIES = Object.values(MODERATION_CATEGORIES).flat().map(cat => cat.key)
const MOST_CRITICAL = [
  'sexual/minors',
  'hate/threatening',
  'harassment/threatening',
  'self-harm/intent',
  'self-harm/instructions',
  'violence/graphic',
]

export default function ModerationConfigModal({ isOpen, onClose, onSave, initialConfig }: ModerationConfigModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && initialConfig) {
      setSelectedCategories(new Set(initialConfig.selectedCategories))
    } else if (isOpen) {
      setSelectedCategories(new Set())
    }
  }, [isOpen, initialConfig])

  const allSelected = selectedCategories.size === ALL_CATEGORIES.length
  const someSelected = selectedCategories.size > 0 && selectedCategories.size < ALL_CATEGORIES.length

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  const handleSelectAll = () => {
    setSelectedCategories(new Set(ALL_CATEGORIES))
  }

  const handleSelectMostCritical = () => {
    setSelectedCategories(new Set(MOST_CRITICAL))
  }

  const handleClear = () => {
    setSelectedCategories(new Set())
  }

  const handleToggleCategory = (categoryKey: string) => {
    const newSet = new Set(selectedCategories)
    if (newSet.has(categoryKey)) {
      newSet.delete(categoryKey)
    } else {
      newSet.add(categoryKey)
    }
    setSelectedCategories(newSet)
  }

  const handleSave = () => {
    onSave({ selectedCategories })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#173153] border border-white/15 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/15">
          <h2 className="text-xl font-semibold text-white">Moderation guardrail</h2>
          <p className="text-sm text-[#9ca3af] mt-1">
            Flag text containing disallowed{' '}
            <a href="#" className="text-[#3b82f6] underline hover:text-[#60a5fa]">content categories</a>.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Select All / Quick Actions */}
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
                className="w-4 h-4 rounded border-white/25 bg-[#072448] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0"
              />
              <span className="text-sm text-white">Select all categories</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1.5 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white transition-colors"
              >
                All Categories
              </button>
              <button
                onClick={handleSelectMostCritical}
                className="px-3 py-1.5 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white transition-colors"
              >
                Most Critical
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Category Sections */}
          {Object.entries(MODERATION_CATEGORIES).map(([sectionKey, categories]) => (
            <div key={sectionKey} className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3 capitalize">
                {sectionKey === 'selfHarm' ? 'Self-Harm' : sectionKey.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.key}
                    className="flex items-start gap-3 cursor-pointer hover:bg-[#072448] p-2 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category.key)}
                      onChange={() => handleToggleCategory(category.key)}
                      className="w-4 h-4 rounded border-white/25 bg-[#072448] text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{category.label}</div>
                      <div className="text-xs text-[#9ca3af] mt-0.5">{category.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/15 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}