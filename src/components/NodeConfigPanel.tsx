'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit2, Copy, Check, Link, MessageCircle, Code, Sparkles, FileText, Wand2, Type, CheckSquare, Grid3x3, Brackets, Braces, Info, Settings, ChevronDown, Plug } from 'lucide-react'
import { Node } from '@xyflow/react'
import { AgentNodeData, GuardrailsNodeData, IfElseNodeData, WhileNodeData, UserApprovalNodeData, TransformNodeData, SetStateNodeData, NoteNodeData, FileSearchNodeData, MCPNodeData, ClassifyNodeData, StartNodeData, EndNodeData, JSONSchema } from '@/types'
import SchemaEditorModal from './SchemaEditorModal'
import Tooltip from './Tooltip'
import Menu from './Menu'
import PIIConfigModal from './PIIConfigModal'
import ModerationConfigModal from './ModerationConfigModal'
import JailbreakConfigModal from './JailbreakConfigModal'
import HallucinationConfigModal from './HallucinationConfigModal'
import NSFWConfigModal from './NSFWConfigModal'
import URLFilterConfigModal from './URLFilterConfigModal'
import PromptInjectionConfigModal from './PromptInjectionConfigModal'
import CustomPromptCheckConfigModal from './CustomPromptCheckConfigModal'
import FunctionConfigModal from './FunctionConfigModal'
import MCPConfigModal from './MCPConfigModal'
import TransformConfigForm from './TransformConfigForm'

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
  const [showPIIConfigModal, setShowPIIConfigModal] = useState(false)
  const [showModerationConfigModal, setShowModerationConfigModal] = useState(false)
  const [showJailbreakConfigModal, setShowJailbreakConfigModal] = useState(false)
  const [showHallucinationConfigModal, setShowHallucinationConfigModal] = useState(false)
  const [showNSFWConfigModal, setShowNSFWConfigModal] = useState(false)
  const [showURLFilterConfigModal, setShowURLFilterConfigModal] = useState(false)
  const [showPromptInjectionConfigModal, setShowPromptInjectionConfigModal] = useState(false)
  const [showCustomPromptCheckConfigModal, setShowCustomPromptCheckConfigModal] = useState(false)
  const [showFunctionConfigModal, setShowFunctionConfigModal] = useState(false)
  const [showMCPConfigModal, setShowMCPConfigModal] = useState(false)
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [editingStateVarIndex, setEditingStateVarIndex] = useState<number | null>(null)
  const [stateVarDraft, setStateVarDraft] = useState<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'object' | 'list'
    defaultValue: string | number | boolean | string[] | undefined
  } | null>(null)
  const [listInputValue, setListInputValue] = useState<string>('')
  const [showSchemaModal, setShowSchemaModal] = useState(false)
  const [showAgentSchemaModal, setShowAgentSchemaModal] = useState(false)
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
  const [showEndSchemaModal, setShowEndSchemaModal] = useState(false)

  useEffect(() => {
    setConfig(node.data)
    setEditingStateVarIndex(null)
    setStateVarDraft(null)
    setListInputValue('')
    setShowSchemaModal(false)
    setSchemaProperties([])
    setSchemaAdvancedJson('')
    setEnumInputValues({})
    setArrayItemEnumInputValues({})
    setShowEndSchemaModal(false)
  }, [node])

  // Update Advanced view in real-time when Simple view changes
  useEffect(() => {
    if (schemaView === 'simple' && showSchemaModal) {
      const schema = generateSchemaFromProperties()
      setSchemaAdvancedJson(JSON.stringify(schema, null, 2))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaProperties, schemaView, showSchemaModal])

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
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
            placeholder="Call the model with your instructions and tools."
          />
        </div>


        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={data.model || 'gpt-5'}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
          >
            <option value="gpt-5">GPT-5</option>
            <option value="gpt-5-mini">GPT-5 Mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Output format</label>
          <select
            value={data.outputFormat || 'text'}
            onChange={(e) => handleChange('outputFormat', e.target.value)}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="text">Text</option>
            <option value="json">JSON</option>
            <option value="widgets">Widgets</option>
          </select>
          {data.outputFormat === 'json' && (
            <button
              onClick={() => setShowAgentSchemaModal(true)}
              className="mt-2 px-3 py-1.5 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors flex items-center gap-2"
            >
              {data.schema?.properties && Object.keys(data.schema.properties).length > 0 ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit schema
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add schema
                </>
              )}
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Tools</label>
            <Menu
              align="right"
              side="bottom"
              trigger={
                <button className="flex items-center gap-1 px-2 py-1 text-sm bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded transition-colors">
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              }
            >
              <button
                onClick={() => {
                  setEditingToolIndex(null)
                  setShowMCPConfigModal(true)
                }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#072448] transition-colors flex items-center gap-2"
              >
                <Plug className="w-4 h-4 text-[#6b7280]" />
                <span>MCP server</span>
              </button>
              <button
                onClick={() => {
                  setEditingToolIndex(null)
                  setShowFunctionConfigModal(true)
                }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-[#072448] transition-colors flex items-center gap-2"
              >
                <Code className="w-4 h-4 text-[#6b7280]" />
                <span>Function</span>
              </button>
            </Menu>
          </div>
          {data.tools && data.tools.length > 0 ? (
            <div className="space-y-2">
              {data.tools.map((tool: any, index: number) => {
                let displayName = tool.type
                if (tool.type === 'function' && tool.config?.definition) {
                  try {
                    const parsed = JSON.parse(tool.config.definition)
                    displayName = parsed.name || 'Function'
                  } catch {
                    displayName = 'Function'
                  }
                } else if (tool.type === 'mcp') {
                  displayName = tool.config?.servers?.[0]?.label || tool.config?.serverName || 'MCP server'
                }
                
                return (
                  <div key={index} className="flex items-center justify-between bg-[#072448] rounded px-2 py-1">
                    <div className="flex items-center gap-2">
                      {tool.type === 'function' ? (
                        <Code className="w-4 h-4 text-[#6b7280]" />
                      ) : tool.type === 'mcp' ? (
                        <Plug className="w-4 h-4 text-[#6b7280]" />
                      ) : null}
                      <span className="text-sm text-white">{displayName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {(tool.type === 'function' || tool.type === 'mcp') && (
                        <button
                          onClick={() => {
                            setEditingToolIndex(index)
                            if (tool.type === 'function') {
                              setShowFunctionConfigModal(true)
                            } else {
                              setShowMCPConfigModal(true)
                            }
                          }}
                          className="p-1 hover:bg-[#2a2a2a] rounded"
                          title={tool.type === 'function' ? 'Edit function' : 'Edit MCP server'}
                        >
                          <Edit2 className="w-3 h-3 text-[#6b7280]" />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          const newTools = data.tools.filter((_: any, i: number) => i !== index)
                          handleChange('tools', newTools)
                        }}
                        className="p-1 hover:bg-[#2a2a2a] rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-sm text-[#6b7280]">No tools added</div>
          )}
        </div>

        {/* Function Configuration Modal */}
        <FunctionConfigModal
          isOpen={showFunctionConfigModal}
          onClose={() => {
            setShowFunctionConfigModal(false)
            setEditingToolIndex(null)
          }}
          onSave={(functionConfig) => {
            const tools = [...(data.tools || [])]
            if (editingToolIndex !== null) {
              // Update existing function
              tools[editingToolIndex] = {
                ...tools[editingToolIndex],
                config: functionConfig
              }
            } else {
              // Add new function
              tools.push({
                type: 'function',
                config: functionConfig
              })
            }
            handleChange('tools', tools)
            setShowFunctionConfigModal(false)
            setEditingToolIndex(null)
          }}
          initialConfig={
            editingToolIndex !== null && data.tools?.[editingToolIndex]?.config
              ? data.tools[editingToolIndex].config
              : undefined
          }
        />

        {/* MCP Configuration Modal */}
        <MCPConfigModal
          isOpen={showMCPConfigModal}
          onClose={() => {
            setShowMCPConfigModal(false)
            setEditingToolIndex(null)
          }}
          onSave={(mcpConfig) => {
            const tools = [...(data.tools || [])]
            if (editingToolIndex !== null) {
              // Update existing MCP tool
              tools[editingToolIndex] = {
                ...tools[editingToolIndex],
                config: mcpConfig
              }
            } else {
              // Add new MCP tool
              tools.push({
                type: 'mcp',
                config: mcpConfig
              })
            }
            handleChange('tools', tools)
            setShowMCPConfigModal(false)
            setEditingToolIndex(null)
          }}
          initialConfig={
            editingToolIndex !== null && data.tools?.[editingToolIndex]?.config
              ? data.tools[editingToolIndex].config
              : undefined
          }
        />
      </div>
    )
  }

  const renderGuardrailsConfig = () => {
    const data = config as GuardrailsNodeData

    const tooltipContent: Record<string, string> = {
      'Personally identifiable information': 'Detects and blocks personally identifiable information (PII) such as names, emails, phone numbers, and addresses.',
      'Moderation': 'Classifies and blocks harmful content (e.g., hate/harassment or sexual content).',
      'Jailbreak': 'Detects attempts to bypass safety guidelines or restrictions.',
      'Hallucination': 'Identifies potentially false or unsubstantiated claims in generated content.',
      'NSFW Text': 'Filters out not safe for work (NSFW) text content.',
      'URL Filter': 'Blocks or filters specific URLs or domains.',
      'Prompt Injection Detection': 'Detects attempts to inject malicious prompts or instructions.',
      'Custom Prompt Check': 'Applies custom validation rules to prompts.',
      'Continue on error': 'Allows the workflow to continue even if a guardrail check fails.',
    }

    const ToggleSwitch = ({ checked, onChange, label, showInfo = true, showSettings = true, tooltip, onConfigure }: {
      checked: boolean
      onChange: (checked: boolean) => void
      label: string
      showInfo?: boolean
      showSettings?: boolean
      tooltip?: string
      onConfigure?: () => void
    }) => (
      <div className="flex items-center justify-between py-2 relative">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm text-white">{label}</span>
          {showInfo && tooltip && (
            <Tooltip content={tooltip} position="left">
              <button className="p-0.5 hover:bg-[#072448] rounded-full transition-colors">
                <Info className="w-3.5 h-3.5 text-[#6b7280]" />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showSettings && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onConfigure?.()
              }}
              className="p-0.5 hover:bg-[#072448] rounded-full transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#6b7280]" />
            </button>
          )}
          <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors border ${
              checked ? 'bg-[#3b82f6] border-[#3b82f6]' : 'bg-[#072448] border-white/15'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                checked ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    )

    return (
      <div className="space-y-4">
        {/* Name field */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-white whitespace-nowrap">Name</label>
          <input
            type="text"
            value={data.name || data.label || 'Guardrails'}
            onChange={(e) => {
              const newName = e.target.value
              const newConfig = { ...config, name: newName, label: newName }
              setConfig(newConfig)
              onUpdate(node.id, newConfig)
            }}
            className="flex-1 bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="Guardrails"
          />
        </div>

        {/* Input field - static chip */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Input</label>
          <div className="flex items-center gap-2 bg-[#072448] border border-white/15 rounded-lg px-3 py-2">
            <FileText className="w-4 h-4 text-[#10b981] flex-shrink-0" />
            <span className="text-white text-sm flex-1">input_as_text</span>
            <span className="text-[#6b7280] text-xs">string</span>
          </div>
        </div>

        {/* Guardrail toggles */}
        <div className="space-y-1 border-t border-white/15 pt-4">
          <ToggleSwitch
            checked={data.pii ?? false}
            onChange={(checked) => handleChange('pii', checked)}
            label="Personally identifiable information"
            tooltip={tooltipContent['Personally identifiable information']}
            onConfigure={() => setShowPIIConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.moderation !== 'off'}
            onChange={(checked) => handleChange('moderation', checked ? 'critical' : 'off')}
            label="Moderation"
            tooltip={tooltipContent['Moderation']}
            onConfigure={() => setShowModerationConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.jailbreak ?? false}
            onChange={(checked) => handleChange('jailbreak', checked)}
            label="Jailbreak"
            tooltip={tooltipContent['Jailbreak']}
            onConfigure={() => setShowJailbreakConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.hallucination ?? false}
            onChange={(checked) => handleChange('hallucination', checked)}
            label="Hallucination"
            tooltip={tooltipContent['Hallucination']}
            onConfigure={() => setShowHallucinationConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.nsfwText ?? false}
            onChange={(checked) => handleChange('nsfwText', checked)}
            label="NSFW Text"
            tooltip={tooltipContent['NSFW Text']}
            onConfigure={() => setShowNSFWConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.urlFilter ?? false}
            onChange={(checked) => handleChange('urlFilter', checked)}
            label="URL Filter"
            tooltip={tooltipContent['URL Filter']}
            onConfigure={() => setShowURLFilterConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.promptInjectionDetection ?? false}
            onChange={(checked) => handleChange('promptInjectionDetection', checked)}
            label="Prompt Injection Detection"
            tooltip={tooltipContent['Prompt Injection Detection']}
            onConfigure={() => setShowPromptInjectionConfigModal(true)}
          />
          <ToggleSwitch
            checked={data.customPromptCheck ?? false}
            onChange={(checked) => handleChange('customPromptCheck', checked)}
            label="Custom Prompt Check"
            tooltip={tooltipContent['Custom Prompt Check']}
            onConfigure={() => setShowCustomPromptCheckConfigModal(true)}
          />
        </div>

        {/* Continue on error */}
        <div className="border-t border-white/15 pt-4">
          <ToggleSwitch
            checked={data.continueOnError ?? false}
            onChange={(checked) => handleChange('continueOnError', checked)}
            label="Continue on error"
            tooltip={tooltipContent['Continue on error']}
            showSettings={false}
          />
        </div>

        {/* PII Configuration Modal */}
        <PIIConfigModal
          isOpen={showPIIConfigModal}
          onClose={() => setShowPIIConfigModal(false)}
          onSave={(piiConfig) => {
            const newConfig = {
              ...config,
              piiConfig: {
                action: piiConfig.action,
                selectedEntities: Array.from(piiConfig.selectedEntities),
              },
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.piiConfig ? {
            action: data.piiConfig.action,
            selectedEntities: new Set(data.piiConfig.selectedEntities || []),
          } : undefined}
        />

        {/* Moderation Configuration Modal */}
        <ModerationConfigModal
          isOpen={showModerationConfigModal}
          onClose={() => setShowModerationConfigModal(false)}
          onSave={(moderationConfig) => {
            const newConfig = {
              ...config,
              moderationConfig: {
                selectedCategories: Array.from(moderationConfig.selectedCategories),
              },
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.moderationConfig ? {
            selectedCategories: new Set(data.moderationConfig.selectedCategories || []),
          } : undefined}
        />

        {/* Jailbreak Configuration Modal */}
        <JailbreakConfigModal
          isOpen={showJailbreakConfigModal}
          onClose={() => setShowJailbreakConfigModal(false)}
          onSave={(jailbreakConfig) => {
            const newConfig = {
              ...config,
              jailbreakConfig,
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.jailbreakConfig}
        />

        {/* Hallucination Configuration Modal */}
        <HallucinationConfigModal
          isOpen={showHallucinationConfigModal}
          onClose={() => setShowHallucinationConfigModal(false)}
          onSave={(hallucinationConfig) => {
            const newConfig = {
              ...config,
              hallucinationConfig,
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.hallucinationConfig}
        />

        {/* NSFW Configuration Modal */}
        <NSFWConfigModal
          isOpen={showNSFWConfigModal}
          onClose={() => setShowNSFWConfigModal(false)}
          onSave={(nsfwConfig) => {
            const newConfig = {
              ...config,
              nsfwConfig,
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.nsfwConfig}
        />

        {/* URL Filter Configuration Modal */}
        <URLFilterConfigModal
          isOpen={showURLFilterConfigModal}
          onClose={() => setShowURLFilterConfigModal(false)}
          onSave={(urlFilterConfig) => {
            const newConfig = {
              ...config,
              urlFilterConfig,
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.urlFilterConfig}
        />

        {/* Prompt Injection Configuration Modal */}
        <PromptInjectionConfigModal
          isOpen={showPromptInjectionConfigModal}
          onClose={() => setShowPromptInjectionConfigModal(false)}
          onSave={(promptInjectionConfig) => {
            const newConfig = {
              ...config,
              promptInjectionConfig,
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.promptInjectionConfig}
        />

        {/* Custom Prompt Check Configuration Modal */}
        <CustomPromptCheckConfigModal
          isOpen={showCustomPromptCheckConfigModal}
          onClose={() => setShowCustomPromptCheckConfigModal(false)}
          onSave={(customPromptCheckConfig) => {
            const newConfig = {
              ...config,
              customPromptCheckConfig,
            }
            setConfig(newConfig)
            onUpdate(node.id, newConfig)
          }}
          initialConfig={data.customPromptCheckConfig}
        />
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
                className="w-full bg-[#072448] border border-white/15 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
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
            className="flex items-center gap-1 px-2 py-1 text-sm bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded transition-colors"
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
          <label className="block text-sm font-medium mb-2 text-white">Expression</label>
          <textarea
            value={data.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
            rows={3}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
            placeholder='state.boolean_var == "test"'
          />
          <p className="text-xs text-[#6b7280] mt-1">
            Use Common Expression Language to create a custom expression.{' '}
            <a href="#" className="text-[#3b82f6] underline" onClick={(e) => e.preventDefault()}>
              Learn more.
            </a>
          </p>
        </div>
      </div>
    )
  }

  const renderUserApprovalConfig = () => {
    const data = config as UserApprovalNodeData
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-white whitespace-nowrap">Name</label>
          <input
            type="text"
            value={data.label || data.name || 'User approval'}
            onChange={(e) => handleChange('label', e.target.value)}
            className="flex-1 bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="User approval"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Message</label>
          <textarea
            value={data.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
            placeholder="Describe the message to show the user. Eg. ok to proceed?"
          />
        </div>
      </div>
    )
  }

  const renderTransformConfig = () => {
    const data = config as TransformNodeData
    return (
      <TransformConfigForm
        data={data}
        nodeId={node.id}
        onChange={(updates) => {
          // Merge all updates at once to avoid race conditions
          const newConfig = { ...config, ...updates }
          setConfig(newConfig)
          onUpdate(node.id, newConfig)
        }}
        onDelete={() => {
          setShowDeleteConfirm(true)
        }}
      />
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
            onChange={(e) => {
              const sanitized = sanitizeVariableName(e.target.value)
              handleChange('variableName', sanitized)
            }}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="my_variable"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Value</label>
          <textarea
            value={data.value || ''}
            onChange={(e) => handleChange('value', e.target.value)}
            rows={4}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none font-mono text-sm"
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
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
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
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            placeholder="Enter search query"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Max Results</label>
          <input
            type="number"
            value={data.maxResults || ''}
            onChange={(e) => handleChange('maxResults', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
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

  const renderClassifyConfig = () => {
    const data = config as ClassifyNodeData
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-white whitespace-nowrap">Name</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="flex-1 bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-white whitespace-nowrap">Input</label>
            <div className="flex items-center gap-2 flex-1 bg-[#072448] border border-white/15 rounded-lg px-3 py-2">
              <div className="w-4 h-4 rounded bg-[#10b981] flex items-center justify-center flex-shrink-0">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-sm">{data.input || 'input_as_text'}</span>
              <div className="bg-[#072448] border border-white/15 rounded px-2 py-0.5">
                <span className="text-white text-xs">STRING</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => handleChange('input', undefined)}
                  className="p-1 hover:bg-[#3a3a3a] rounded text-[#6b7280] hover:text-white transition-colors"
                  title="Remove input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">Categories</label>
          </div>
          <div className="space-y-2">
            {(data.categories || []).map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 bg-[#072448] border border-white/15 rounded-lg px-3 py-2 text-white">
                  {category}
                </div>
                <button
                  onClick={() => {
                    const newCategories = [...(data.categories || [])]
                    newCategories.splice(index, 1)
                    handleChange('categories', newCategories)
                  }}
                  className="p-1.5 hover:bg-[#2a2a2a] rounded text-[#6b7280] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newCategories = [...(data.categories || []), `Category ${(data.categories?.length || 0) + 1}`]
              handleChange('categories', newCategories)
            }}
            className="mt-2 flex items-center gap-1 px-2 py-1 text-sm bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded text-white transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white">Classifier</label>
          <select
            value={data.classifier || 'gpt-4.1'}
            onChange={(e) => handleChange('classifier', e.target.value)}
            className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
          >
            <option value="gpt-4.1">GPT-4.1</option>
            <option value="gpt-5">GPT-5</option>
            <option value="gpt-5-mini">GPT-5 Mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">Examples</label>
          </div>
          <div className="space-y-4">
            {(data.examples || []).map((example, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Example {index + 1}</span>
                  <button
                    onClick={() => {
                      const newExamples = [...(data.examples || [])]
                      newExamples.splice(index, 1)
                      handleChange('examples', newExamples.length > 0 ? newExamples : [{ input: '', category: '' }])
                    }}
                    className="p-1 hover:bg-[#2a2a2a] rounded-full text-[#6b7280] hover:text-white transition-colors"
                    title="Remove example"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={example.input || ''}
                    onChange={(e) => {
                      const newExamples = [...(data.examples || [])]
                      newExamples[index] = { ...example, input: e.target.value }
                      handleChange('examples', newExamples)
                    }}
                    rows={2}
                    className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none text-sm"
                    placeholder="Write an example input..."
                  />
                  <MessageCircle className="absolute bottom-2 right-2 w-4 h-4 text-[#10b981]" />
                </div>
                <select
                  value={example.category || ''}
                  onChange={(e) => {
                    const newExamples = [...(data.examples || [])]
                    newExamples[index] = { ...example, category: e.target.value }
                    handleChange('examples', newExamples)
                  }}
                  className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors cursor-pointer"
                >
                  <option value="">Select category</option>
                  {(data.categories || []).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newExamples = [...(data.examples || []), { input: '', category: '' }]
              handleChange('examples', newExamples)
            }}
            className="mt-2 flex items-center gap-1 px-2 py-1 text-sm bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded text-white transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add example</span>
          </button>
        </div>
      </div>
    )
  }

  const renderStartConfig = () => {
    const data = config as StartNodeData
    const inputVariables = data.inputVariables || [{ name: 'input_as_text', type: 'string' }]
    const stateVariables = data.stateVariables || []

    return (
      <div className="space-y-6">
        {/* Input variables - read-only */}
        <div>
          <label className="block text-sm font-medium mb-3 text-white">Input variables</label>
          <div className="space-y-2">
            {inputVariables.map((variable, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#072448] border border-white/15 rounded-lg px-3 py-2"
              >
                <FileText className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                <span className="text-white text-sm flex-1">{variable.name}</span>
                <span className="text-[#6b7280] text-xs">{variable.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State variables list */}
        <div>
          <label className="block text-sm font-medium mb-3 text-white">State variables</label>
          {stateVariables.length > 0 && (
            <div className="space-y-2 mb-3">
              {stateVariables.map((variable, index) => {
                const typeLabel = variable.type || 'string'
                let preview = ''
                if (variable.defaultValue !== undefined) {
                  if (Array.isArray(variable.defaultValue)) {
                    preview = variable.defaultValue.join(', ')
                  } else if (typeof variable.defaultValue === 'boolean') {
                    preview = variable.defaultValue ? 'true' : 'false'
                  } else {
                    preview = String(variable.defaultValue)
                  }
                }

                return (
                  <div
                    key={`${variable.name}-${index}`}
                    className="flex items-center gap-3 bg-[#072448] border border-white/15 rounded-lg px-3 py-2"
                  >
                    <div className="flex-shrink-0">
                      {getStateVariableIcon(variable.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-white truncate">
                          {variable.name || 'Unnamed variable'}
                        </span>
                        <span className="text-xs text-[#9ca3af] uppercase tracking-wide">
                          {typeLabel}
                        </span>
                      </div>
                      {preview && (
                        <div className="text-xs text-[#6b7280] mt-0.5 truncate">
                          {preview}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setEditingStateVarIndex(index)
                        const varType = (variable.type as any) || 'string'
                        let defaultValue: string | number | boolean | string[] | undefined = undefined
                        
                        if (varType === 'boolean') {
                          defaultValue = (variable.defaultValue === true || variable.defaultValue === 'true' || variable.defaultValue === 'True') ? true : false ? true : false
                        } else if (varType === 'number') {
                          defaultValue = variable.defaultValue !== undefined ? Number(variable.defaultValue) : undefined
                        } else if (varType === 'list') {
                          if (Array.isArray(variable.defaultValue)) {
                            defaultValue = variable.defaultValue
                            setListInputValue(variable.defaultValue.join(', '))
                          } else if (typeof variable.defaultValue === 'string' && variable.defaultValue) {
                            defaultValue = variable.defaultValue.split(',').map(item => item.trim())
                            setListInputValue(variable.defaultValue)
                          } else {
                            defaultValue = []
                            setListInputValue('')
                          }
                        } else {
                          defaultValue = variable.defaultValue !== undefined 
                            ? String(variable.defaultValue) 
                            : undefined
                        }
                        
                        setStateVarDraft({
                          name: variable.name || '',
                          type: varType,
                          defaultValue: defaultValue,
                        })
                      }}
                      className="p-1.5 hover:bg-[#2a2a2a] rounded text-[#6b7280] hover:text-white transition-colors"
                      title="Configure state variable"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const newStateVars = [...stateVariables]
                        newStateVars.splice(index, 1)
                        handleChange('stateVariables', newStateVars)
                        if (editingStateVarIndex === index) {
                          setEditingStateVarIndex(null)
                          setStateVarDraft(null)
                        }
                      }}
                      className="p-1.5 hover:bg-[#2a2a2a] rounded text-[#6b7280] hover:text-white transition-colors"
                      title="Delete state variable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <button
            onClick={() => {
              const index = stateVariables.length
              setEditingStateVarIndex(index)
              setStateVarDraft({
                name: '',
                type: 'string',
                defaultValue: undefined,
              })
              setListInputValue('')
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* State variable editor panel */}
        {editingStateVarIndex !== null && stateVarDraft && (
          <div className="mt-2 bg-[#072448] border border-white/15 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                {editingStateVarIndex < stateVariables.length
                  ? 'Edit state variable'
                  : 'Add state variable'}
              </h4>
              <button
                onClick={() => {
                  setEditingStateVarIndex(null)
                  setStateVarDraft(null)
                }}
                className="p-1 hover:bg-[#2a2a2a] rounded text-[#6b7280] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type tabs */}
            <div className="inline-flex rounded-lg bg-[#072448] border border-white/15 text-xs font-medium overflow-hidden">
              {(['string', 'number', 'boolean', 'object', 'list'] as const).map((type, index) => (
                <button
                  key={type}
                  onClick={() => {
                    setStateVarDraft((prev) =>
                      prev ? { ...prev, type, defaultValue: prev.defaultValue } : prev
                    )
                    // Reset list input when type changes
                    if (type === 'list') {
                      setListInputValue('')
                    }
                  }}
                  className={`px-3 py-1.5 transition-colors ${
                    index > 0 ? 'border-l border-white/15' : ''
                  } ${
                    stateVarDraft.type === type
                      ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                      : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {type === 'list' ? 'List' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Name & default value */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-white">Name</label>
                <input
                  type="text"
                  value={stateVarDraft.name}
                  onChange={(e) => {
                    const sanitized = sanitizeVariableName(e.target.value)
                    setStateVarDraft((prev) => (prev ? { ...prev, name: sanitized } : prev))
                  }}
                  placeholder="Enter the variable name"
                  className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>
              {stateVarDraft.type !== 'object' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-white">
                    Default value <span className="text-[#6b7280]">Optional</span>
                  </label>
                  {stateVarDraft.type === 'boolean' ? (
                    <select
                      value={stateVarDraft.defaultValue === true || stateVarDraft.defaultValue === 'true' ? 'true' : 'false'}
                      onChange={(e) =>
                        setStateVarDraft((prev) =>
                          prev ? { ...prev, defaultValue: e.target.value === 'true' } : prev
                        )
                      }
                      className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : stateVarDraft.type === 'number' ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={stateVarDraft.defaultValue === '' || stateVarDraft.defaultValue === undefined 
                        ? '' 
                        : (typeof stateVarDraft.defaultValue === 'number' 
                          ? String(stateVarDraft.defaultValue)
                          : (typeof stateVarDraft.defaultValue === 'string' ? stateVarDraft.defaultValue : ''))}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only allow digits, single decimal point, and optional minus sign at start
                        const sanitized = value.replace(/[^0-9.-]/g, '').replace(/(\..*)\./g, '$1').replace(/^-?/, (match) => value.startsWith('-') ? '-' : '')
                        if (sanitized === '' || sanitized === '-') {
                          setStateVarDraft((prev) =>
                            prev ? { ...prev, defaultValue: undefined } : prev
                          )
                        } else {
                          const numValue = Number(sanitized)
                          if (!isNaN(numValue)) {
                            setStateVarDraft((prev) =>
                              prev ? { ...prev, defaultValue: numValue } : prev
                            )
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Prevent 'e', 'E', '+', and other non-numeric characters
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault()
                        }
                      }}
                      placeholder="0"
                      className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                    />
                  ) : stateVarDraft.type === 'list' ? (
                    <div>
                      <input
                        type="text"
                        value={listInputValue}
                        onChange={(e) => {
                          // Allow free typing with commas
                          setListInputValue(e.target.value)
                        }}
                        onBlur={() => {
                          // Convert to array when user leaves the field
                          const arrayValue = listInputValue === '' 
                            ? [] 
                            : listInputValue.split(',').map(item => item.trim()).filter(item => item !== '')
                          setStateVarDraft((prev) =>
                            prev ? { ...prev, defaultValue: arrayValue } : prev
                          )
                        }}
                        placeholder="item1, item2, item3"
                        className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                      />
                      <p className="text-xs text-[#6b7280] mt-1">Enter comma-separated values</p>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={stateVarDraft.defaultValue !== undefined ? String(stateVarDraft.defaultValue) : ''}
                      onChange={(e) =>
                        setStateVarDraft((prev) =>
                          prev ? { ...prev, defaultValue: e.target.value } : prev
                        )
                      }
                      placeholder="Default value"
                      className="w-full bg-[#072448] border border-white/15 rounded-md px-3 py-2 text-white text-sm placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
                    />
                  )}
                </div>
              )}
              {stateVarDraft.type === 'object' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-white">Schema</label>
                  <button
                    onClick={() => {
                      // Load existing schema if editing
                      const existingVar = editingStateVarIndex < stateVariables.length 
                        ? stateVariables[editingStateVarIndex] 
                        : null
                      if (existingVar?.schema) {
                        // Convert schema to properties array for Simple view
                        const props = Object.entries(existingVar.schema.properties || {}).map(([name, def]: [string, any]) => {
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
                            required: (existingVar.schema?.required || []).includes(name),
                            itemsType,
                            itemsDescription,
                            itemsEnumValues,
                            enumValues,
                          }
                        })
                        setSchemaProperties(props)
                        setSchemaAdvancedJson(JSON.stringify(existingVar.schema, null, 2))
                      } else {
                        setSchemaProperties([])
                        setSchemaAdvancedJson('')
                      }
                      setShowSchemaModal(true)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-white text-sm transition-colors"
                  >
                    {(() => {
                      const existingVar = editingStateVarIndex < stateVariables.length 
                        ? stateVariables[editingStateVarIndex] 
                        : null
                      const hasSchema = existingVar?.schema !== undefined
                      return hasSchema ? (
                        <>
                          <Edit2 className="w-4 h-4" />
                          <span>Edit schema</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add schema</span>
                        </>
                      )
                    })()}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {(() => {
                // Check current config state, not just stateVariables, to get latest schema updates
                const currentStateVars = (config as StartNodeData).stateVariables || []
                const existingVar = editingStateVarIndex < currentStateVars.length 
                  ? currentStateVars[editingStateVarIndex] 
                  : null
                const hasSchema = existingVar?.schema !== undefined
                const hasProperties = hasSchema && existingVar?.schema?.properties && Object.keys(existingVar.schema.properties).length > 0
                const isObjectWithoutProperties = stateVarDraft.type === 'object' && !hasProperties
                
                return isObjectWithoutProperties ? (
                  <div className="bg-[#fef3c7] border border-[#fbbf24] rounded-md px-3 py-2 text-sm text-[#92400e]">
                    <p>Object type requires at least one property in the schema. Please add a schema with at least one property.</p>
                  </div>
                ) : null
              })()}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!stateVarDraft.name.trim()) {
                      return
                    }
                    
                    // Use current config state to get latest schema updates (including schema changes from modal)
                    const currentStateVars = (config as StartNodeData).stateVariables || []
                    
                    // Validate object type has schema with properties
                    const existingVar = editingStateVarIndex < currentStateVars.length 
                      ? currentStateVars[editingStateVarIndex] 
                      : null
                    const hasSchema = existingVar?.schema !== undefined
                    const hasProperties = hasSchema && existingVar?.schema?.properties && Object.keys(existingVar.schema.properties).length > 0
                    
                    if (stateVarDraft.type === 'object' && !hasProperties) {
                      // Don't allow saving - show error (already shown above)
                      return
                    }
                    
                    const newStateVars = [...currentStateVars]
                    
                    // Process default value based on type
                    let processedDefaultValue = stateVarDraft.defaultValue
                    if (stateVarDraft.type === 'boolean') {
                      processedDefaultValue = stateVarDraft.defaultValue === true || stateVarDraft.defaultValue === 'true'
                    } else if (stateVarDraft.type === 'number') {
                      processedDefaultValue = stateVarDraft.defaultValue === '' || stateVarDraft.defaultValue === undefined 
                        ? undefined 
                        : Number(stateVarDraft.defaultValue)
                    } else if (stateVarDraft.type === 'list') {
                      processedDefaultValue = Array.isArray(stateVarDraft.defaultValue) && stateVarDraft.defaultValue.length > 0
                        ? stateVarDraft.defaultValue
                        : undefined
                    } else if (stateVarDraft.type === 'string') {
                      processedDefaultValue = stateVarDraft.defaultValue === '' ? undefined : String(stateVarDraft.defaultValue)
                    }

                    if (editingStateVarIndex < currentStateVars.length) {
                      // Editing existing variable - preserve schema from current config
                      const currentVar = currentStateVars[editingStateVarIndex]
                      newStateVars[editingStateVarIndex] = {
                        name: stateVarDraft.name.trim(),
                        type: stateVarDraft.type,
                        defaultValue: processedDefaultValue,
                        schema: currentVar?.schema || undefined,
                      }
                    } else {
                      // Adding new variable
                      newStateVars.push({
                        name: stateVarDraft.name.trim(),
                        type: stateVarDraft.type,
                        defaultValue: processedDefaultValue,
                        schema: undefined,
                      })
                    }
                    handleChange('stateVariables', newStateVars)
                    setEditingStateVarIndex(null)
                    setStateVarDraft(null)
                    setListInputValue('')
                  }}
                  disabled={(() => {
                    if (stateVarDraft.type !== 'object') return false
                    // Check current config state to get latest schema updates
                    const currentStateVars = (config as StartNodeData).stateVariables || []
                    const existingVar = editingStateVarIndex < currentStateVars.length 
                      ? currentStateVars[editingStateVarIndex] 
                      : null
                    const hasSchema = existingVar?.schema !== undefined
                    const hasProperties = hasSchema && existingVar?.schema?.properties && Object.keys(existingVar.schema.properties).length > 0
                    // Only disable if object type and no schema with properties
                    return !hasProperties
                  })()}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    (() => {
                      if (stateVarDraft.type !== 'object') return false
                      // Check current config state to get latest schema updates
                      const currentStateVars = (config as StartNodeData).stateVariables || []
                      const existingVar = editingStateVarIndex < currentStateVars.length 
                        ? currentStateVars[editingStateVarIndex] 
                        : null
                      const hasSchema = existingVar?.schema !== undefined
                      const hasProperties = hasSchema && existingVar?.schema?.properties && Object.keys(existingVar.schema.properties).length > 0
                      return !hasProperties
                    })()
                      ? 'bg-[#072448] text-[#6b7280] cursor-not-allowed opacity-50'
                      : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
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
        
        // For enum types, add enum values and set type to string
        if (prop.type === 'ENUM') {
          propertyDef.type = 'string'
          if (prop.enumValues && prop.enumValues.length > 0) {
            propertyDef.enum = prop.enumValues
          }
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

  const sanitizeVariableName = (value: string): string => {
    // Only allow lowercase alphanumeric and underscores
    return value.toLowerCase().replace(/[^a-z0-9_]/g, '')
  }

  const getStateVariableIcon = (type?: 'string' | 'number' | 'boolean' | 'object' | 'list') => {
    switch (type) {
      case 'string':
        return <FileText className="w-4 h-4 text-[#10b981]" />
      case 'number':
        return (
          <div className="w-4 h-4 rounded bg-[#3b82f6] flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
        )
      case 'boolean':
        return (
          <div className="w-4 h-4 rounded bg-[#f97316] flex items-center justify-center relative">
            <div className="w-2.5 h-2.5 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
          </div>
        )
      case 'list':
        return <Brackets className="w-4 h-4 text-[#a855f7]" />
      case 'object':
        return <Braces className="w-4 h-4 text-[#8b5cf6]" />
      default:
        return <FileText className="w-4 h-4 text-[#10b981]" />
    }
  }

  const renderSchemaModal = () => {
    if (!showSchemaModal) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSchemaModal(false)}>
        <div className="bg-[#173153] border border-white/15 rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-white/15">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Structured output (JSON)</h2>
                <p className="text-sm text-[#9ca3af]">The model will generate a JSON object that matches this schema.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-[#072448] border border-white/15 text-xs font-medium overflow-hidden">
                  <button
                    onClick={() => setSchemaView('simple')}
                    className={`px-4 py-2 transition-colors ${
                      schemaView === 'simple'
                        ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                        : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setSchemaView('advanced')}
                    className={`px-4 py-2 transition-colors border-l border-white/15 ${
                      schemaView === 'advanced'
                        ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                        : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
                <button
                  onClick={() => setShowSchemaModal(false)}
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
                  <div className="border border-white/15 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 bg-[#072448] px-3 py-2 text-xs font-medium text-[#9ca3af] border-b border-white/15">
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
                                className="w-full bg-[#072448] border border-white/15 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
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
                                className="w-full bg-[#072448] border border-white/15 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
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
                                className="w-full bg-[#072448] border border-white/15 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
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
                              <div className="grid grid-cols-12 gap-2 px-3 py-3 items-center bg-[#072448]/50 pl-8">
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
                                    className="w-full bg-[#072448] border border-white/15 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
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
                                    className="w-full bg-[#072448] border border-white/15 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                                    placeholder="Add description"
                                  />
                                </div>
                                <div className="col-span-1">
                                  {/* Empty space to align with parent row */}
                                </div>
                              </div>
                              {/* Nested Enum Values for Array Items */}
                              {prop.itemsType === 'ENUM' && (
                                <div className="px-3 py-3 bg-[#072448]/30 pl-12">
                                  <div className="flex flex-wrap items-center gap-2 min-h-[32px] bg-[#072448] border border-white/15 rounded px-2 py-1.5">
                                    {(prop.itemsEnumValues || []).map((value, valueIndex) => (
                                      <div
                                        key={valueIndex}
                                        className="flex items-center gap-1.5 bg-[#072448] border border-white/15 rounded-full px-2.5 py-1 text-sm text-white"
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
                            <div className="px-3 py-3 bg-[#072448]/50 pl-8">
                              <div className="flex flex-wrap items-center gap-2 min-h-[32px] bg-[#072448] border border-white/15 rounded px-2 py-1.5">
                                {(prop.enumValues || []).map((value, valueIndex) => (
                                  <div
                                    key={valueIndex}
                                    className="flex items-center gap-1.5 bg-[#072448] border border-white/15 rounded-full px-2.5 py-1 text-sm text-white"
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
                    className="mt-3 flex items-center gap-1 px-3 py-2 text-sm bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded text-white transition-colors"
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
                  className="w-full h-96 bg-[#072448] border border-white/15 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] resize-none"
                  placeholder='{\n  "type": "object",\n  "properties": {},\n  "additionalProperties": false,\n  "required": []\n}'
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/15 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setShowSchemaModal(false)
                setSchemaProperties([])
                setSchemaAdvancedJson('')
              }}
              className="px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
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

                // Update the state variable with the schema
                if (editingStateVarIndex !== null && stateVarDraft) {
                  const newStateVars = [...(config as StartNodeData).stateVariables || []]
                  if (editingStateVarIndex < newStateVars.length) {
                    newStateVars[editingStateVarIndex] = {
                      ...newStateVars[editingStateVarIndex],
                      schema: finalSchema,
                    }
                  } else {
                    newStateVars.push({
                      name: stateVarDraft.name,
                      type: stateVarDraft.type,
                      defaultValue: stateVarDraft.defaultValue,
                      schema: finalSchema,
                    })
                  }
                  handleChange('stateVariables', newStateVars)
                }

                setShowSchemaModal(false)
              }}
              className="px-4 py-2 bg-[#3b82f6] text-white rounded-md text-sm font-medium hover:bg-[#2563eb] transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderMCPConfig = () => {
    const data = config as MCPNodeData
    const selectedServer = data.mcpConfig?.servers?.[0]

    return (
      <>
        <div className="space-y-4">
          {/* Selected Server Display */}
          {selectedServer ? (
            <div className="bg-[#072448] border border-white/15 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                  <Plug className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">{selectedServer.label}</span>
                    {selectedServer.isPrebuilt && (
                      <span className="text-xs px-1.5 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] rounded flex-shrink-0">Prebuilt</span>
                    )}
                  </div>
                  {selectedServer.description && (
                    <p className="text-xs text-[#9ca3af] line-clamp-2 break-words">{selectedServer.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMCPConfigModal(true)
                    }}
                    className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors flex-shrink-0"
                    title="Configure server"
                    type="button"
                  >
                    <Edit2 className="w-4 h-4 text-[#6b7280]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleChange('mcpConfig', undefined)
                      handleChange('serverName', undefined)
                    }}
                    className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors flex-shrink-0"
                    title="Remove server"
                    type="button"
                  >
                    <X className="w-4 h-4 text-[#6b7280]" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Add Server Button */
            <button
              onClick={() => setShowMCPConfigModal(true)}
              className="w-full px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] rounded-md text-sm text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plug className="w-4 h-4" />
              Add MCP Server
            </button>
          )}
        </div>

        {/* MCP Configuration Modal */}
        <MCPConfigModal
          isOpen={showMCPConfigModal}
          onClose={() => setShowMCPConfigModal(false)}
          onSave={(mcpConfig) => {
            handleChange('mcpConfig', mcpConfig)
            // Also update serverName for backward compatibility
            if (mcpConfig.servers && mcpConfig.servers.length > 0) {
              handleChange('serverName', mcpConfig.servers[0].label)
            }
            setShowMCPConfigModal(false)
          }}
          initialConfig={data.mcpConfig}
        />
      </>
    )
  }

  const renderEndConfig = () => {
    const data = config as EndNodeData

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-white">Output</label>
          <button
            onClick={() => setShowEndSchemaModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-white text-sm transition-colors"
          >
            {data.schema ? (
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
      </div>
    )
  }

  const renderConfig = () => {
    switch (node.type) {
      case 'start':
        return renderStartConfig()
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
      case 'classify':
        return renderClassifyConfig()
      case 'end':
        return renderEndConfig()
      default:
        return (
          <div className="text-sm text-[#6b7280]">
            Configuration for {node.type} nodes coming soon
          </div>
        )
    }
  }

  return (
    <>
      {renderSchemaModal()}
      <SchemaEditorModal
        isOpen={showEndSchemaModal}
        initialSchema={(config as EndNodeData).schema}
        onClose={() => setShowEndSchemaModal(false)}
        onSave={(schema: JSONSchema) => {
          handleChange('schema', schema)
          setShowEndSchemaModal(false)
        }}
      />
      <SchemaEditorModal
        isOpen={showAgentSchemaModal}
        initialSchema={(config as AgentNodeData).schema}
        onClose={() => setShowAgentSchemaModal(false)}
        onSave={(schema: JSONSchema) => {
          handleChange('schema', schema)
          setShowAgentSchemaModal(false)
        }}
      />
      <div className="w-96 bg-[#173153] border border-white/15 flex flex-col shadow-2xl rounded-lg m-2 max-h-[calc(95vh-56px)] overflow-hidden scale-in">
      <div className="p-4 border-b border-white/15 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            {node.type === 'guardrails' ? 'Guardrails' : node.type === 'transform' ? 'Transform' : String(config.label ?? node.type)}
          </h3>
          {node.type === 'agent' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Call the model with your instructions and tools.
            </p>
          )}
          {node.type === 'guardrails' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Run moderation, PII, jailbreak, or hallucination checks
            </p>
          )}
          {node.type === 'ifElse' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Create conditions to branch your workflow
            </p>
          )}
          {node.type === 'while' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Loop while a condition is true
            </p>
          )}
          {node.type === 'userApproval' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Pause for a human to approve or reject a step
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
          {node.type === 'classify' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Sort messages into categories with a model
            </p>
          )}
          {node.type === 'start' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Define the workflow inputs
            </p>
          )}
          {node.type === 'end' && (
            <p className="text-xs text-[#9ca3af] mt-1">
              Choose the workflow output
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!(node.data?.isDefault || node.type === 'start') && (
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

      <div className="p-4 border-t border-white/15 flex items-center justify-end gap-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
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
          <div className="bg-[#173153] border border-white/15 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Node</h3>
            <p className="text-sm text-[#9ca3af] mb-6">
              Are you sure you want to delete "{config.label || node.type}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-transparent border border-white/15 hover:border-white/25 hover:bg-white/5 rounded-md text-sm text-white font-medium transition-colors"
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
    </>
  )
}
