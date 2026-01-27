'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Zap, Eye, EyeOff, ChevronDown, X, Info } from 'lucide-react'

interface MCPServer {
  id: string
  url: string
  label: string
  description?: string
  authType?: 'access_token' | 'api_key' | 'none'
  accessToken?: string
  isPrebuilt?: boolean
}

interface MCPConfig {
  servers: MCPServer[]
}

interface MCPConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: MCPConfig) => void
  initialConfig?: MCPConfig
}

const PREBUILT_SERVERS = [
  {
    id: 'customer-details-mcp',
    name: 'CustomerDetailsMCPServer',
    label: 'CustomerDetailsMCPServer',
    description: 'Prebuilt MCP server for customer details',
    url: 'https://mcp.customerdetails.com',
    isPrebuilt: true,
  },
]

type DialogState = 'serverList' | 'addCustomServer'

export default function MCPConfigModal({ isOpen, onClose, onSave, initialConfig }: MCPConfigModalProps) {
  const [servers, setServers] = useState<MCPServer[]>([])
  const [dialogState, setDialogState] = useState<DialogState>('serverList')
  const [showPassword, setShowPassword] = useState(false)
  
  // Form state for adding/connecting server
  const [formData, setFormData] = useState({
    url: '',
    label: '',
    description: '',
    authType: 'access_token' as 'access_token' | 'api_key' | 'none',
    accessToken: '',
  })

  useEffect(() => {
    if (isOpen && initialConfig) {
      setServers(initialConfig.servers || [])
      setDialogState('serverList')
    } else if (isOpen) {
      setServers([])
      setDialogState('serverList')
    }
  }, [isOpen, initialConfig])

  const handleSave = () => {
    onSave({ servers })
    onClose()
  }

  const handleAddServer = () => {
    if (formData.url && formData.label) {
      const newServer: MCPServer = {
        id: `mcp-${Date.now()}`,
        url: formData.url,
        label: formData.label,
        description: formData.description,
        authType: formData.authType,
        accessToken: formData.accessToken,
        isPrebuilt: false,
      }
      // Only allow one server - replace existing if any
      setServers([newServer])
      setFormData({
        url: '',
        label: '',
        description: '',
        authType: 'access_token',
        accessToken: '',
      })
      setDialogState('serverList')
    }
  }

  const handleSelectPrebuiltServer = (prebuiltServer: typeof PREBUILT_SERVERS[0]) => {
    const newServer: MCPServer = {
      id: prebuiltServer.id,
      url: prebuiltServer.url,
      label: prebuiltServer.label,
      description: prebuiltServer.description,
      isPrebuilt: true,
    }
    // Only allow one server - replace existing if any
    setServers([newServer])
  }

  const handleRemoveServer = (serverId: string) => {
    setServers(servers.filter(s => s.id !== serverId))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          {dialogState === 'serverList' ? (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Add MCP server</h2>
              <button
                onClick={() => setDialogState('addCustomServer')}
                disabled={servers.length > 0}
                className={`px-3 py-1.5 border border-[#3a3a3a] rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  servers.length > 0
                    ? 'bg-[#1a1a1a] text-[#6b7280] cursor-not-allowed opacity-50'
                    : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                Add custom server
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDialogState('serverList')}
                className="p-1 hover:bg-[#2a2a2a] rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Connect to MCP Server</h2>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {dialogState === 'serverList' ? (
            <>
              {/* Added Server */}
              {servers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3">Added server</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {servers.map((server) => (
                      <div
                        key={server.id}
                        className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 hover:border-[#3a3a3a] transition-colors relative group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <button
                            onClick={() => handleRemoveServer(server.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#2a2a2a] rounded"
                          >
                            <X className="w-3 h-3 text-[#6b7280]" />
                          </button>
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{server.label}</div>
                        {server.description && (
                          <div className="text-xs text-[#9ca3af] line-clamp-2">{server.description}</div>
                        )}
                        {server.isPrebuilt && (
                          <div className="mt-1">
                            <span className="text-xs px-1.5 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded">Prebuilt</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prebuilt Servers */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Prebuilt servers</h3>
                {servers.length > 0 && (
                  <p className="text-xs text-[#9ca3af] mb-3">
                    Only one MCP server can be added. Selecting a new server will replace the current one.
                  </p>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {PREBUILT_SERVERS.map((server) => {
                    const isAdded = servers.some(s => s.id === server.id)
                    return (
                      <button
                        key={server.id}
                        onClick={() => handleSelectPrebuiltServer(server)}
                        className={`bg-[#0a0a0a] border rounded-lg p-3 transition-colors text-left ${
                          isAdded
                            ? 'border-[#3b82f6]'
                            : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center mb-2">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{server.name}</div>
                        {server.description && (
                          <div className="text-xs text-[#9ca3af] line-clamp-2">{server.description}</div>
                        )}
                        {isAdded && (
                          <div className="mt-2">
                            <span className="text-xs px-1.5 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded">Selected</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Add/Connect Server Form */
            <div className="space-y-6">
              {servers.length > 0 && (
                <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-md px-3 py-2">
                  <p className="text-xs text-[#9ca3af]">
                    Only one MCP server can be added. Adding a new server will replace the current one.
                  </p>
                </div>
              )}
              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">URL</label>
                <p className="text-xs text-[#9ca3af] mb-2">Only use MCP servers you trust and verify</p>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://mcp.example.com"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="my_mcp_server"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description <span className="text-[#6b7280]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="My MCP Server"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>

              {/* Authentication */}
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  Authentication
                  <button className="p-0.5 hover:bg-[#2a2a2a] rounded-full">
                    <Info className="w-3.5 h-3.5 text-[#6b7280]" />
                  </button>
                </label>
                <div className="relative mb-2">
                  <select
                    value={formData.authType}
                    onChange={(e) => setFormData({ ...formData, authType: e.target.value as any })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] appearance-none cursor-pointer"
                  >
                    <option value="access_token">Access token / API key</option>
                    <option value="api_key">API key</option>
                    <option value="none">None</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280] pointer-events-none" />
                </div>
                {formData.authType !== 'none' && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.accessToken}
                      onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                      placeholder="Add your access token"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 pr-10 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#2a2a2a] rounded"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-[#6b7280]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#6b7280]" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a2a2a] flex items-center justify-between">
          {dialogState === 'serverList' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
              >
                Cancel
              </button>
              {servers.length > 0 && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-md text-sm font-medium transition-colors"
                >
                  Save
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setDialogState('serverList')}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  if (formData.url && formData.label) {
                    const newServer: MCPServer = {
                      id: `mcp-${Date.now()}`,
                      url: formData.url,
                      label: formData.label,
                      description: formData.description,
                      authType: formData.authType,
                      accessToken: formData.accessToken,
                      isPrebuilt: false,
                    }
                    // Only allow one server - replace existing if any
                    onSave({ servers: [newServer] })
                    onClose()
                  }
                }}
                disabled={!formData.url || !formData.label}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  !formData.url || !formData.label
                    ? 'bg-[#2a2a2a] text-[#6b7280] cursor-not-allowed'
                    : 'bg-white hover:bg-gray-100 text-black'
                }`}
              >
                <Zap className="w-4 h-4" />
                Connect
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}