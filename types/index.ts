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
  tools: Array<{
    type: 'fileSearch' | 'mcp'
    config?: any
  }>
}

export interface GuardrailsNodeData extends NodeData {
  pii: boolean
  moderation: 'off' | 'critical' | 'mostCritical'
  jailbreak: boolean
  hallucination: boolean
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
}

export interface Workflow {
  id: string
  name: string
  status: 'draft' | 'production'
  version: string
  nodes: WorkflowNode[]
  edges: Edge[]
}

export interface NodeDefinition {
  type: NodeType
  category: NodeCategory
  label: string
  icon: string
  color: string
  description: string
}
