'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

interface URLFilterConfig {
  allowedUrls: string[]
  allowedSchemes: string[]
  blockUserInfo: boolean
  allowSubdomains: boolean
}

interface URLFilterConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: URLFilterConfig) => void
  initialConfig?: URLFilterConfig
}

export default function URLFilterConfigModal({ isOpen, onClose, onSave, initialConfig }: URLFilterConfigModalProps) {
  const [allowedUrls, setAllowedUrls] = useState<string[]>([])
  const [allowedSchemes, setAllowedSchemes] = useState<string[]>(['https'])
  const [blockUserInfo, setBlockUserInfo] = useState(true)
  const [allowSubdomains, setAllowSubdomains] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [schemeInput, setSchemeInput] = useState('')

  useEffect(() => {
    if (isOpen && initialConfig) {
      setAllowedUrls(initialConfig.allowedUrls || [])
      setAllowedSchemes(initialConfig.allowedSchemes || ['https'])
      setBlockUserInfo(initialConfig.blockUserInfo ?? true)
      setAllowSubdomains(initialConfig.allowSubdomains ?? false)
    } else if (isOpen) {
      setAllowedUrls([])
      setAllowedSchemes(['https'])
      setBlockUserInfo(true)
      setAllowSubdomains(false)
    }
  }, [isOpen, initialConfig])

  const handleAddUrl = () => {
    if (urlInput.trim() && !allowedUrls.includes(urlInput.trim())) {
      setAllowedUrls([...allowedUrls, urlInput.trim()])
      setUrlInput('')
    }
  }

  const handleRemoveUrl = (url: string) => {
    setAllowedUrls(allowedUrls.filter(u => u !== url))
  }

  const handleAddScheme = () => {
    if (schemeInput.trim() && !allowedSchemes.includes(schemeInput.trim())) {
      setAllowedSchemes([...allowedSchemes, schemeInput.trim()])
      setSchemeInput('')
    }
  }

  const handleRemoveScheme = (scheme: string) => {
    setAllowedSchemes(allowedSchemes.filter(s => s !== scheme))
  }

  const handleSave = () => {
    onSave({ allowedUrls, allowedSchemes, blockUserInfo, allowSubdomains })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#173153] border border-white/15 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/15">
          <h2 className="text-xl font-semibold text-white">URL filter guardrail</h2>
          <p className="text-sm text-[#9ca3af] mt-1">
            Blocks URLs that fall outside your allow list or violate allowed schemes.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* URL Allow List */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">URL allow list</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
                placeholder="example.com"
                className="flex-1 bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              />
              <button
                onClick={handleAddUrl}
                className="w-10 h-10 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            {allowedUrls.length === 0 ? (
              <p className="text-xs text-[#9ca3af]">
                No allow list entries added yet. Add domains, IP addresses, or CIDR ranges to allow.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {allowedUrls.map((url) => (
                  <div
                    key={url}
                    className="flex items-center gap-1 bg-[#072448] border border-white/15 rounded-md px-2 py-1 text-sm text-white"
                  >
                    <span>{url}</span>
                    <button
                      onClick={() => handleRemoveUrl(url)}
                      className="hover:bg-[#3a3a3a] rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Allowed Schemes */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Allowed schemes</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={schemeInput}
                onChange={(e) => setSchemeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddScheme()}
                placeholder="https"
                className="flex-1 bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              />
              <button
                onClick={handleAddScheme}
                className="w-10 h-10 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-xs text-[#9ca3af] mb-2">
              Only URLs using the listed schemes will be allowed.
            </p>
            {allowedSchemes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allowedSchemes.map((scheme) => (
                  <div
                    key={scheme}
                    className="flex items-center gap-1 bg-[#072448] border border-white/15 rounded-md px-2 py-1 text-sm text-white"
                  >
                    <span>{scheme}</span>
                    <button
                      onClick={() => handleRemoveScheme(scheme)}
                      className="hover:bg-[#3a3a3a] rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Block User Info */}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-white">Block user info</div>
              <div className="text-xs text-[#9ca3af] mt-0.5">
                Reject URLs containing username or password segments.
              </div>
            </div>
            <button
              onClick={() => setBlockUserInfo(!blockUserInfo)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border ${
                blockUserInfo ? 'bg-[#3b82f6] border-[#3b82f6]' : 'bg-[#072448] border-white/15'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  blockUserInfo ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Allow Subdomains */}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-white">Allow subdomains</div>
              <div className="text-xs text-[#9ca3af] mt-0.5">
                When enabled, subdomains of allowed domains will be permitted.
              </div>
            </div>
            <button
              onClick={() => setAllowSubdomains(!allowSubdomains)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border ${
                allowSubdomains ? 'bg-[#3b82f6] border-[#3b82f6]' : 'bg-[#072448] border-white/15'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  allowSubdomains ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
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