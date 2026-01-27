import { Node, Edge } from '@xyflow/react'

export type NodeType = 
  | 'start'
  | 'agent'
  | 'end'
  | 'note'
  | 'fileSearch'
  | 'guardrails'
  | 'mcp'
  | 'ifElse'
  | 'while'
  | 'userApproval'
  | 'transform'
  | 'setState'
  | 'classify'

export type NodeCategory = 'core' | 'tools' | 'logic' | 'data'

export interface WorkflowNode extends Node {
  type: NodeType
  data: NodeData
}

export interface NodeData {
  label: string
  [key: string]: any
}

export interface AgentNodeData extends NodeData {
  name: string
  instructions: string
  model: string
  reasoning: 'minimum' | 'medium' | 'maximum'
  includeChatHistory: boolean
  outputFormat: 'text' | 'json' | 'widgets'
  verbosity: 'low' | 'medium' | 'high'
  summary: 'null' | 'low' | 'medium' | 'high'
  schema?: JSONSchema
  tools: Array<{
    type: 'fileSearch' | 'mcp' | 'function'
    config?: any
  }>
}

export interface GuardrailsNodeData extends NodeData {
  name?: string
  input?: string
  inputType?: string
  pii: boolean
  piiConfig?: {
    action: 'mask' | 'block'
    selectedEntities: string[]
  }
  moderation: 'off' | 'critical' | 'mostCritical'
  moderationConfig?: {
    selectedCategories: string[]
  }
  jailbreak: boolean
  jailbreakConfig?: {
    model: string
    confidenceThreshold: number
  }
  hallucination: boolean
  hallucinationConfig?: {
    vectorStoreId: string
    model: string
    confidenceThreshold: number
  }
  nsfwText?: boolean
  nsfwConfig?: {
    model: string
    confidenceThreshold: number
  }
  urlFilter?: boolean
  urlFilterConfig?: {
    allowedUrls: string[]
    allowedSchemes: string[]
    blockUserInfo: boolean
    allowSubdomains: boolean
  }
  promptInjectionDetection?: boolean
  promptInjectionConfig?: {
    model: string
    confidenceThreshold: number
  }
  customPromptCheck?: boolean
  customPromptCheckConfig?: {
    systemPrompt: string
    model: string
    confidenceThreshold: number
  }
  continueOnError?: boolean
  vectorStoreId?: string
}

export interface IfElseNodeData extends NodeData {
  conditions: Array<{
    name?: string
    expression: string
  }>
}

export interface WhileNodeData extends NodeData {
  condition: string
  maxIterations?: number
}

export interface UserApprovalNodeData extends NodeData {
  message?: string
  timeout?: number
}

export interface TransformNodeData extends NodeData {
  expression: string
  outputType?: 'json' | 'text'
}

export interface SetStateNodeData extends NodeData {
  variableName: string
  value: string
}

export interface NoteNodeData extends NodeData {
  content: string
}

export interface FileSearchNodeData extends NodeData {
  query?: string
  maxResults?: number
  vectorStoreId?: string
}

export interface MCPNodeData extends NodeData {
  serverName?: string
  toolName?: string
  parameters?: Record<string, any>
  mcpConfig?: {
    servers: Array<{
      id: string
      url: string
      label: string
      description?: string
      authType?: 'access_token' | 'api_key' | 'none'
      accessToken?: string
      isPrebuilt?: boolean
    }>
  }
}

export interface ClassifyNodeData extends NodeData {
  name: string
  input?: string
  inputType?: string
  categories: string[]
  classifier: string
  examples?: Array<{
    input: string
    category: string
  }>
}

export interface JSONSchemaProperty {
  name: string
  type: 'STR' | 'NUM' | 'BOOL' | 'ENUM' | 'OBJ' | 'ARR'
  description?: string
  default?: any
  required?: boolean
}

export interface JSONSchema {
  type: 'object'
  properties: Record<string, {
    type: string
    description?: string
    default?: any
  }>
  additionalProperties: boolean
  required: string[]
}

export interface StartNodeStateVariable {
  name: string
  type?: 'string' | 'number' | 'boolean' | 'object' | 'list'
  defaultValue?: string | number | boolean | string[]
  schema?: JSONSchema
}

export interface StartNodeData extends NodeData {
  inputVariables?: Array<{
    name: string
    type: string
  }>
  stateVariables?: StartNodeStateVariable[]
}

export interface EndNodeData extends NodeData {
  schema?: JSONSchema
}

export interface Workflow {
  id: string
  name: string
  status: 'draft' | 'production'
  version: string
  nodes: WorkflowNode[]
  edges: Edge[]
  createdAt?: string
  updatedAt?: string
  author?: string
  description?: string
  isTemplate?: boolean
}

export interface NodeDefinition {
  type: NodeType
  category: NodeCategory
  label: string
  icon: string
  color: string
  description: string
}
