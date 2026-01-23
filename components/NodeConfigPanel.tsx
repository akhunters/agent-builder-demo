'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit2 } from 'lucide-react'
import { Node } from '@xyflow/react'
import { AgentNodeData, GuardrailsNodeData, IfElseNodeData } from '@/types'

interface NodeConfigPanelProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
  onClose: () => void
}

export default function NodeConfigPanel({ node, onUpdate, onClose }: NodeConfigPanelProps) {
  const [config, setConfig] = useState(node.data)

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
              className="w-4 h-4 text-[#3b82f6] bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-[#3b82f6]"
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
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
              className="w-4 h-4 text-blue-500 bg-[#0a0a0a] border-[#2a2a2a] rounded"
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
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
              className="w-4 h-4 text-blue-500 bg-[#0a0a0a] border-[#2a2a2a] rounded"
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
              className="w-4 h-4 text-blue-500 bg-[#0a0a0a] border-[#2a2a2a] rounded"
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

  const renderConfig = () => {
    switch (node.type) {
      case 'agent':
        return renderAgentConfig()
      case 'guardrails':
        return renderGuardrailsConfig()
      case 'ifElse':
        return renderIfElseConfig()
      default:
        return (
          <div className="text-sm text-[#6b7280]">
            Configuration for {node.type} nodes coming soon
          </div>
        )
    }
  }

  return (
    <div className="w-96 bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col">
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{config.label || node.type}</h3>
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
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors text-[#9ca3af] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderConfig()}
      </div>

      <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between">
        <button className="text-sm text-[#9ca3af] hover:text-white transition-colors">Less</button>
        <button className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-sm text-white font-medium transition-colors">
          Evaluate
        </button>
      </div>
    </div>
  )
}
