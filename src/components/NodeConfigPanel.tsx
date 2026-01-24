'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit2, Copy, Check, Link, MessageCircle, Code, Sparkles } from 'lucide-react'
import { Node } from '@xyflow/react'
import { AgentNodeData, GuardrailsNodeData, IfElseNodeData, WhileNodeData, UserApprovalNodeData, TransformNodeData, SetStateNodeData, NoteNodeData, FileSearchNodeData, MCPNodeData } from '@/types'

interface NodeConfigPanelProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
  onClose: () => void
}

export default function NodeConfigPanel({ node, onUpdate, onDelete, onClose }: NodeConfigPanelProps) {
  const [config, setConfig] = useState<Record<string, any>>((node.data || {}) as Record<string, any>)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMCPModal, setShowMCPModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setConfig(node.data)
  }, [node])

  const handleChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    onUpdate(node.id, newConfig)
  }

  const renderAgentConfig = () => {
    const data = config as AgentNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Instructions</label>
            <button className="p-1 hover:bg-[#2a2a2a] rounded">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={data.instructions || ''}
            onChange={(e) => handleChange('instructions', e.target.value)}
            rows={6}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
            placeholder="Call the model with your instructions and tools."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Include chat history</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeChatHistory ?? true}
              onChange={(e) => handleChange('includeChatHistory', e.target.checked)}
            />
            <span className="text-sm text-white">On</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={data.model || 'gpt-5'}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
          >
            <option value="gpt-5">GPT-5</option>
            <option value="gpt-5-mini">GPT-5 Mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reasoning effort</label>
          <select
            value={data.reasoning || 'medium'}
            onChange={(e) => handleChange('reasoning', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="minimum">Minimum</option>
            <option value="medium">Medium</option>
            <option value="maximum">Maximum</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Output format</label>
          <select
            value={data.outputFormat || 'text'}
            onChange={(e) => handleChange('outputFormat', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="text">Text</option>
            <option value="json">JSON</option>
            <option value="widgets">Widgets</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Verbosity</label>
          <select
            value={data.verbosity || 'medium'}
            onChange={(e) => handleChange('verbosity', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Summary</label>
          <select
            value={data.summary || 'null'}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="null">Null</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Tools</label>
            <button className="flex items-center gap-1 px-2 py-1 text-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded">
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
          {data.tools && data.tools.length > 0 ? (
            <div className="space-y-2">
              {data.tools.map((tool: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-[#0a0a0a] rounded px-2 py-1">
                  <span className="text-sm">{tool.type}</span>
                  <button className="p-1 hover:bg-[#2a2a2a] rounded">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[#6b7280]">No tools added</div>
          )}
        </div>
      </div>
    )
  }

  const renderGuardrailsConfig = () => {
    const data = config as GuardrailsNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <input
            type="text"
            value="input_as_text"
            disabled
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-gray-400"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.pii ?? false}
              onChange={(e) => handleChange('pii', e.target.checked)}
            />
            <span className="text-sm">Personally identifiable information (PII)</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm">Moderation</label>
            <button className="p-1 hover:bg-[#2a2a2a] rounded">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
          <select
            value={data.moderation || 'off'}
            onChange={(e) => handleChange('moderation', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="off">Off</option>
            <option value="critical">Critical</option>
            <option value="mostCritical">Most Critical</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.jailbreak ?? false}
              onChange={(e) => handleChange('jailbreak', e.target.checked)}
            />
            <span className="text-sm text-white">Jailbreak</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.hallucination ?? false}
              onChange={(e) => handleChange('hallucination', e.target.checked)}
            />
            <span className="text-sm text-white">Hallucination</span>
          </label>
        </div>
      </div>
    )
  }

  const renderIfElseConfig = () => {
    const data = config as IfElseNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">If</label>
          {data.conditions?.map((condition, index) => (
            <div key={index} className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Case name (optional)"
                value={condition.name || ''}
                onChange={(e) => {
                  const newConditions = [...(data.conditions || [])]
                  newConditions[index] = { ...condition, name: e.target.value }
                  handleChange('conditions', newConditions)
                }}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
              />
              <textarea
                placeholder="Use Common Expression Language to create a custom expression"
                value={condition.expression}
                onChange={(e) => {
                  const newConditions = [...(data.conditions || [])]
                  newConditions[index] = { ...condition, expression: e.target.value }
                  handleChange('conditions', newConditions)
                }}
                rows={3}
                className="w-full bg-[#3b82f6]/10 border border-[#3b82f6] rounded-md px-3 py-2 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none text-sm text-white placeholder:text-[#6b7280]"
              />
            </div>
          ))}
          <button
            onClick={() => {
              const newConditions = [...(data.conditions || []), { expression: '' }]
              handleChange('conditions', newConditions)
            }}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
      </div>
    )
  }

  const renderWhileConfig = () => {
    const data = config as WhileNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Condition</label>
          <textarea
            value={data.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
            rows={3}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
            placeholder="Use Common Expression Language to create a condition"
          />
          <p className="text-xs text-[#6b7280] mt-1">Loop will continue while this condition is true</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Max Iterations (optional)</label>
          <input
            type="number"
            value={data.maxIterations || ''}
            onChange={(e) => handleChange('maxIterations', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>
    )
  }

  const renderUserApprovalConfig = () => {
    const data = config as UserApprovalNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Message</label>
          <textarea
            value={data.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
            placeholder="Enter the message to show to the user for approval"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Timeout (seconds, optional)</label>
          <input
            type="number"
            value={data.timeout || ''}
            onChange={(e) => handleChange('timeout', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="No timeout"
            min="1"
          />
        </div>
      </div>
    )
  }

  const renderTransformConfig = () => {
    const data = config as TransformNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Expression</label>
          <textarea
            value={data.expression || ''}
            onChange={(e) => handleChange('expression', e.target.value)}
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
            placeholder="Use Common Expression Language to transform data"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Output Format</label>
          <select
            value={data.outputType || 'json'}
            onChange={(e) => handleChange('outputType', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="json">JSON</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>
    )
  }

  const renderSetStateConfig = () => {
    const data = config as SetStateNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Variable Name</label>
          <input
            type="text"
            value={data.variableName || ''}
            onChange={(e) => handleChange('variableName', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="myVariable"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Value</label>
          <textarea
            value={data.value || ''}
            onChange={(e) => handleChange('value', e.target.value)}
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
            placeholder="Enter the value or expression"
          />
        </div>
      </div>
    )
  }

  const renderNoteConfig = () => {
    const data = config as NoteNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Note Content</label>
          <textarea
            value={data.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={6}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
            placeholder="Add your note here..."
          />
        </div>
      </div>
    )
  }

  const renderFileSearchConfig = () => {
    const data = config as FileSearchNodeData
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Search Query</label>
          <input
            type="text"
            value={data.query || ''}
            onChange={(e) => handleChange('query', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="Enter search query"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Max Results</label>
          <input
            type="number"
            value={data.maxResults || ''}
            onChange={(e) => handleChange('maxResults', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="Optional: max number of results"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Vector Store ID</label>
          <input
            type="text"
            value={data.vectorStoreId || ''}
            onChange={(e) => handleChange('vectorStoreId', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="Optional: vector store identifier"
          />
        </div>
      </div>
    )
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const renderMCPConfig = () => {
    const data = config as MCPNodeData
    const platforms = [
      { id: 'chatgpt', name: 'ChatGPT', icon: MessageCircle },
      { id: 'claude-desktop', name: 'Claude Desktop', icon: Sparkles },
      { id: 'cursor', name: 'Cursor', icon: Code },
      { id: 'vscode', name: 'VS Code', icon: Code },
      { id: 'claude-code', name: 'Claude Code', icon: Sparkles },
      { id: 'mcp-url', name: 'MCP URL', icon: Link },
      { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
    ]

    const mcpUrl = data.serverName || 'https://rube.app/mcp'

    return (
      <>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Server Name</label>
            <input
              type="text"
              value={data.serverName || ''}
              onChange={(e) => handleChange('serverName', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="Enter MCP server name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Tool Name</label>
            <input
              type="text"
              value={data.toolName || ''}
              onChange={(e) => handleChange('toolName', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              placeholder="Enter tool name"
            />
          </div>
          <button
            onClick={() => setShowMCPModal(true)}
            className="w-full px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-sm text-white font-medium transition-colors"
          >
            Configure MCP Platform
          </button>
        </div>

        {/* MCP Platform Selection Modal */}
        {showMCPModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMCPModal(false)}>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Select Platform</h2>
                <button
                  onClick={() => setShowMCPModal(false)}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Platform Selection */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Select Platform</h3>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => {
                      const Icon = platform.icon
                      const isSelected = selectedPlatform === platform.id
                      return (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#3b82f6]/20 border-2 border-[#3b82f6] text-[#3b82f6]'
                              : 'bg-[#0a0a0a] border border-[#2a2a2a] text-[#9ca3af] hover:border-[#3a3a3a] hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {platform.name}
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setSelectedPlatform('auth-headers')}
                    className={`mt-3 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedPlatform === 'auth-headers'
                        ? 'bg-[#f97316]/20 border-2 border-[#f97316] text-[#f97316]'
                        : 'bg-[#0a0a0a] border border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10'
                    }`}
                  >
                    <Link className="w-4 h-4" />
                    Auth Headers (N8N & More)
                    {selectedPlatform === 'auth-headers' && <Check className="w-4 h-4" />}
                  </button>
                </div>

                {/* Installation Guide */}
                <div className="border-t border-[#2a2a2a] pt-6">
                  <h3 className="text-base font-semibold text-white mb-4">Installation Guide</h3>
                  
                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#9ca3af] mb-3">Copy the MCP URL with custom auth headers enabled</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={mcpUrl}
                            readOnly
                            className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm"
                          />
                          <button
                            onClick={() => handleCopy(mcpUrl)}
                            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors flex items-center gap-2"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#9ca3af] mb-3">Generate a signed token for Authorization header</p>
                        <button className="px-4 py-2.5 bg-black hover:bg-[#0a0a0a] rounded-md text-sm text-white font-medium transition-colors">
                          Generate Token
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  const renderConfig = () => {
    switch (node.type) {
      case 'agent':
        return renderAgentConfig()
      case 'guardrails':
        return renderGuardrailsConfig()
      case 'ifElse':
        return renderIfElseConfig()
      case 'while':
        return renderWhileConfig()
      case 'userApproval':
        return renderUserApprovalConfig()
      case 'transform':
        return renderTransformConfig()
      case 'setState':
        return renderSetStateConfig()
      case 'note':
        return renderNoteConfig()
      case 'fileSearch':
        return renderFileSearchConfig()
      case 'mcp':
        return renderMCPConfig()
      default:
        return (
          <div className="text-sm text-[#6b7280]">
            Configuration for {node.type} nodes coming soon
          </div>
        )
    }
  }

  return (
    <div className="w-96 bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col shadow-2xl rounded-lg m-2 max-h-[calc(95vh-56px)] overflow-hidden scale-in">
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{String(config.label ?? node.type)}</h3>
          {node.type === 'agent' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Call the model with your instructions and tools.
            </p>
          )}
          {node.type === 'guardrails' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Add safety checks for input and output.
            </p>
          )}
          {node.type === 'ifElse' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Create conditions to branch your workflow
            </p>
          )}
          {node.type === 'while' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Loop until condition is true
            </p>
          )}
          {node.type === 'userApproval' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Add human-in-the-loop approval
            </p>
          )}
          {node.type === 'transform' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Reshape data using CEL expressions
            </p>
          )}
          {node.type === 'setState' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Set global variables accessible throughout workflow
            </p>
          )}
          {node.type === 'note' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Add a note or annotation to your workflow
            </p>
          )}
          {node.type === 'fileSearch' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Search through files using vector search
            </p>
          )}
          {node.type === 'mcp' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Use Model Context Protocol (MCP) tools and servers
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!(node.data?.isDefault || node.type === 'start' || node.type === 'end') && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-[#9ca3af] hover:text-red-400"
              title="Delete node (Delete/Backspace)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderConfig()}
      </div>

      <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-end gap-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
        >
          Close
        </button>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-sm text-white font-medium transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Node</h3>
            <p className="text-sm text-[#9ca3af] mb-6">
              Are you sure you want to delete "{config.label || node.type}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md text-sm text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(node.id)
                  setShowDeleteConfirm(false)
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
