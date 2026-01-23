import { Workflow } from '@/types'
import { WorkflowNode } from '@/types'

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
}

// Template Suggestions - Choose which ones to implement:
export const TEMPLATE_SUGGESTIONS = [
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'AI agent that handles customer inquiries with file search and guardrails',
    category: 'Support',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis Workflow',
    description: 'Workflow for analyzing data with transform nodes and conditional logic',
    category: 'Analytics',
  },
  {
    id: 'content-moderation',
    name: 'Content Moderation',
    description: 'Automated content moderation with guardrails and approval steps',
    category: 'Moderation',
  },
  {
    id: 'multi-step-approval',
    name: 'Multi-Step Approval',
    description: 'Workflow requiring multiple user approvals with conditional branching',
    category: 'Approval',
  },
  {
    id: 'api-integration',
    name: 'API Integration with MCP',
    description: 'Workflow integrating external APIs via MCP with error handling',
    category: 'Integration',
  },
  {
    id: 'document-processor',
    name: 'Document Processor',
    description: 'Processes documents with file search, transformation, and state management',
    category: 'Document',
  },
  {
    id: 'chatbot-with-memory',
    name: 'Chatbot with Memory',
    description: 'Conversational agent with chat history and context management',
    category: 'Chat',
  },
  {
    id: 'conditional-workflow',
    name: 'Conditional Workflow',
    description: 'Complex workflow with multiple if/else branches and loops',
    category: 'Logic',
  },
]

// Template implementations - Add the ones you want to use
export const TEMPLATES: Record<string, TemplateDefinition> = {
  'customer-support': {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'AI agent that handles customer inquiries with file search and guardrails',
    category: 'Support',
    workflow: {
      name: 'Customer Support Agent',
      status: 'draft',
      version: '1.0.0',
      isTemplate: true,
      description: 'AI agent that handles customer inquiries with file search and guardrails',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 100, y: 200 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'guardrails-1',
          type: 'guardrails',
          position: { x: 300, y: 200 },
          data: {
            label: 'Guardrails',
            pii: true,
            moderation: 'critical',
            jailbreak: true,
            hallucination: true,
          },
        },
        {
          id: 'file-search-1',
          type: 'fileSearch',
          position: { x: 500, y: 200 },
          data: {
            label: 'File Search',
            query: 'customer inquiry',
            maxResults: 5,
          },
        },
        {
          id: 'agent-1',
          type: 'agent',
          position: { x: 700, y: 200 },
          data: {
            label: 'Support Agent',
            name: 'Customer Support Agent',
            instructions: 'You are a helpful customer support agent. Use the provided documentation to answer customer inquiries accurately and professionally.',
            model: 'gpt-5',
            reasoning: 'medium',
            includeChatHistory: true,
            outputFormat: 'text',
            verbosity: 'medium',
            summary: 'medium',
            tools: [],
          },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 900, y: 200 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [
        { id: 'e1', source: 'start-default', target: 'guardrails-1' },
        { id: 'e2', source: 'guardrails-1', target: 'file-search-1' },
        { id: 'e3', source: 'file-search-1', target: 'agent-1' },
        { id: 'e4', source: 'agent-1', target: 'end-default' },
      ],
    },
  },
  'data-analysis': {
    id: 'data-analysis',
    name: 'Data Analysis Workflow',
    description: 'Workflow for analyzing data with transform nodes and conditional logic',
    category: 'Analytics',
    workflow: {
      name: 'Data Analysis Workflow',
      status: 'draft',
      version: '1.0.0',
      isTemplate: true,
      description: 'Workflow for analyzing data with transform nodes and conditional logic',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 100, y: 200 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'transform-1',
          type: 'transform',
          position: { x: 300, y: 200 },
          data: {
            label: 'Transform',
            expression: 'input.data',
            outputType: 'json',
          },
        },
        {
          id: 'if-else-1',
          type: 'ifElse',
          position: { x: 500, y: 200 },
          data: {
            label: 'If / Else',
            conditions: [{ expression: 'input.value > 100' }],
            showElse: true,
          },
        },
        {
          id: 'agent-1',
          type: 'agent',
          position: { x: 850, y: 150 },
          data: {
            label: 'High Value',
            name: 'High Value Analysis',
            instructions: 'Analyze high-value data points',
            model: 'gpt-5',
            reasoning: 'medium',
            includeChatHistory: false,
            outputFormat: 'json',
            verbosity: 'low',
            summary: 'null',
            tools: [],
          },
        },
        {
          id: 'agent-2',
          type: 'agent',
          position: { x: 850, y: 250 },
          data: {
            label: 'Low Value',
            name: 'Low Value Analysis',
            instructions: 'Analyze low-value data points',
            model: 'gpt-5',
            reasoning: 'minimum',
            includeChatHistory: false,
            outputFormat: 'json',
            verbosity: 'low',
            summary: 'null',
            tools: [],
          },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 1100, y: 200 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [
        { id: 'e1', source: 'start-default', target: 'transform-1' },
        { id: 'e2', source: 'transform-1', target: 'if-else-1' },
        { id: 'e3', source: 'if-else-1', target: 'agent-1', sourceHandle: 'true' },
        { id: 'e4', source: 'if-else-1', target: 'agent-2', sourceHandle: 'else' },
        { id: 'e5', source: 'agent-1', target: 'end-default' },
        { id: 'e6', source: 'agent-2', target: 'end-default' },
      ],
    },
  },
  'content-moderation': {
    id: 'content-moderation',
    name: 'Content Moderation',
    description: 'Automated content moderation with guardrails and approval steps',
    category: 'Moderation',
    workflow: {
      name: 'Content Moderation',
      status: 'draft',
      version: '1.0.0',
      isTemplate: true,
      description: 'Automated content moderation with guardrails and approval steps',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 100, y: 200 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'guardrails-1',
          type: 'guardrails',
          position: { x: 300, y: 200 },
          data: {
            label: 'Guardrails',
            pii: true,
            moderation: 'mostCritical',
            jailbreak: true,
            hallucination: true,
          },
        },
        {
          id: 'if-else-1',
          type: 'ifElse',
          position: { x: 500, y: 200 },
          data: {
            label: 'If / Else',
            conditions: [{ expression: 'input.moderation_score > 0.7' }],
            showElse: true,
          },
        },
        {
          id: 'user-approval-1',
          type: 'userApproval',
          position: { x: 850, y: 150 },
          data: {
            label: 'User Approval',
            message: 'Content requires manual review. Please approve or reject.',
            timeout: 3600,
          },
        },
        {
          id: 'agent-1',
          type: 'agent',
          position: { x: 850, y: 250 },
          data: {
            label: 'Auto Approve',
            name: 'Auto Approve Agent',
            instructions: 'Content passed moderation checks',
            model: 'gpt-5',
            reasoning: 'minimum',
            includeChatHistory: false,
            outputFormat: 'text',
            verbosity: 'low',
            summary: 'null',
            tools: [],
          },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 1100, y: 200 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [
        { id: 'e1', source: 'start-default', target: 'guardrails-1' },
        { id: 'e2', source: 'guardrails-1', target: 'if-else-1' },
        { id: 'e3', source: 'if-else-1', target: 'user-approval-1', sourceHandle: 'true' },
        { id: 'e4', source: 'if-else-1', target: 'agent-1', sourceHandle: 'else' },
        { id: 'e5', source: 'user-approval-1', target: 'end-default' },
        { id: 'e6', source: 'agent-1', target: 'end-default' },
      ],
    },
  },
  'multi-step-approval': {
    id: 'multi-step-approval',
    name: 'Multi-Step Approval',
    description: 'Workflow requiring multiple user approvals with conditional branching',
    category: 'Approval',
    workflow: {
      name: 'Multi-Step Approval',
      status: 'draft',
      version: '1.0.0',
      isTemplate: true,
      description: 'Workflow requiring multiple user approvals with conditional branching',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 100, y: 200 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'user-approval-1',
          type: 'userApproval',
          position: { x: 300, y: 200 },
          data: {
            label: 'First Approval',
            message: 'Manager approval required',
            timeout: 7200,
          },
        },
        {
          id: 'if-else-1',
          type: 'ifElse',
          position: { x: 500, y: 200 },
          data: {
            label: 'If / Else',
            conditions: [{ expression: 'input.approved == true' }],
            showElse: true,
          },
        },
        {
          id: 'user-approval-2',
          type: 'userApproval',
          position: { x: 850, y: 150 },
          data: {
            label: 'Second Approval',
            message: 'Director approval required',
            timeout: 14400,
          },
        },
        {
          id: 'agent-1',
          type: 'agent',
          position: { x: 850, y: 250 },
          data: {
            label: 'Rejection Handler',
            name: 'Rejection Handler',
            instructions: 'Handle rejection notification',
            model: 'gpt-5',
            reasoning: 'minimum',
            includeChatHistory: false,
            outputFormat: 'text',
            verbosity: 'low',
            summary: 'null',
            tools: [],
          },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 1100, y: 200 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [
        { id: 'e1', source: 'start-default', target: 'user-approval-1' },
        { id: 'e2', source: 'user-approval-1', target: 'if-else-1' },
        { id: 'e3', source: 'if-else-1', target: 'user-approval-2', sourceHandle: 'true' },
        { id: 'e4', source: 'if-else-1', target: 'agent-1', sourceHandle: 'else' },
        { id: 'e5', source: 'user-approval-2', target: 'end-default' },
        { id: 'e6', source: 'agent-1', target: 'end-default' },
      ],
    },
  },
  'api-integration': {
    id: 'api-integration',
    name: 'API Integration with MCP',
    description: 'Workflow integrating external APIs via MCP with error handling',
    category: 'Integration',
    workflow: {
      name: 'API Integration with MCP',
      status: 'draft',
      version: '1.0.0',
      isTemplate: true,
      description: 'Workflow integrating external APIs via MCP with error handling',
      nodes: [
        {
          id: 'start-default',
          type: 'start',
          position: { x: 100, y: 200 },
          data: { label: 'Start', isDefault: true },
        },
        {
          id: 'mcp-1',
          type: 'mcp',
          position: { x: 300, y: 200 },
          data: {
            label: 'MCP',
            serverName: 'api-server',
            toolName: 'fetchData',
            parameters: {},
          },
        },
        {
          id: 'if-else-1',
          type: 'ifElse',
          position: { x: 500, y: 200 },
          data: {
            label: 'If / Else',
            conditions: [{ expression: 'input.success == true' }],
            showElse: true,
          },
        },
        {
          id: 'transform-1',
          type: 'transform',
          position: { x: 850, y: 150 },
          data: {
            label: 'Transform',
            expression: 'input.data',
            outputType: 'json',
          },
        },
        {
          id: 'agent-1',
          type: 'agent',
          position: { x: 850, y: 250 },
          data: {
            label: 'Error Handler',
            name: 'Error Handler',
            instructions: 'Handle API errors gracefully',
            model: 'gpt-5',
            reasoning: 'minimum',
            includeChatHistory: false,
            outputFormat: 'text',
            verbosity: 'low',
            summary: 'null',
            tools: [],
          },
        },
        {
          id: 'end-default',
          type: 'end',
          position: { x: 1100, y: 200 },
          data: { label: 'End', isDefault: true },
        },
      ],
      edges: [
        { id: 'e1', source: 'start-default', target: 'mcp-1' },
        { id: 'e2', source: 'mcp-1', target: 'if-else-1' },
        { id: 'e3', source: 'if-else-1', target: 'transform-1', sourceHandle: 'true' },
        { id: 'e4', source: 'if-else-1', target: 'agent-1', sourceHandle: 'else' },
        { id: 'e5', source: 'transform-1', target: 'end-default' },
        { id: 'e6', source: 'agent-1', target: 'end-default' },
      ],
    },
  },
}
