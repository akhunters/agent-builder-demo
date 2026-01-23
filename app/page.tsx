'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodePalette from '@/components/NodePalette'
import NodeConfigPanel from '@/components/NodeConfigPanel'
import TopBar from '@/components/TopBar'
import { WorkflowNode, NodeType } from '@/types'
import StartNode from '@/components/nodes/StartNode'
import AgentNode from '@/components/nodes/AgentNode'
import EndNode from '@/components/nodes/EndNode'
import GuardrailsNode from '@/components/nodes/GuardrailsNode'
import IfElseNode from '@/components/nodes/IfElseNode'
import NoteNode from '@/components/nodes/NoteNode'
import MCPNode from '@/components/nodes/MCPNode'
import FileSearchNode from '@/components/nodes/FileSearchNode'
import WhileNode from '@/components/nodes/WhileNode'
import UserApprovalNode from '@/components/nodes/UserApprovalNode'
import TransformNode from '@/components/nodes/TransformNode'
import SetStateNode from '@/components/nodes/SetStateNode'

const nodeTypes = {
  start: StartNode,
  agent: AgentNode,
  end: EndNode,
  guardrails: GuardrailsNode,
  ifElse: IfElseNode,
  note: NoteNode,
  mcp: MCPNode,
  fileSearch: FileSearchNode,
  while: WhileNode,
  userApproval: UserApprovalNode,
  transform: TransformNode,
  setState: SetStateNode,
}

function FlowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'start-default',
      type: 'start',
      position: { x: 250, y: 100 },
      data: { label: 'Start', isDefault: true },
    },
    {
      id: 'end-default',
      type: 'end',
      position: { x: 250, y: 300 },
      data: { label: 'End', isDefault: true },
    },
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowName, setWorkflowName] = useState('My Flow')
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'production'>('draft')
  const [showPreview, setShowPreview] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // Don't open popup for start and end nodes
    if (node.type === 'start' || node.type === 'end') {
      return
    }
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleAddNode = useCallback((nodeType: NodeType, position: { x: number; y: number }) => {
    const labelMap: Record<NodeType, string> = {
      start: 'Start',
      agent: 'Agent',
      end: 'End',
      note: 'Note',
      fileSearch: 'File Search',
      guardrails: 'Guardrails',
      mcp: 'MCP',
      ifElse: 'If / Else',
      while: 'While',
      userApproval: 'User Approval',
      transform: 'Transform',
      setState: 'Set State',
    }

    const newNode: WorkflowNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: labelMap[nodeType] || nodeType,
      },
    }

    // Set default data based on node type
    if (nodeType === 'agent') {
      newNode.data = {
        ...newNode.data,
        name: 'My Agent',
        instructions: 'You are a helpful assistant.',
        model: 'gpt-5',
        reasoning: 'medium',
        includeChatHistory: true,
        outputFormat: 'text',
        verbosity: 'medium',
        summary: 'null',
        tools: [],
      }
    } else if (nodeType === 'guardrails') {
      newNode.data = {
        ...newNode.data,
        pii: false,
        moderation: 'off',
        jailbreak: false,
        hallucination: false,
      }
    } else if (nodeType === 'ifElse') {
      newNode.data = {
        ...newNode.data,
        conditions: [{ expression: 'input.output_parsed.classification == "flight_info"' }],
        showElse: true,
      }
    } else if (nodeType === 'while') {
      newNode.data = {
        ...newNode.data,
        condition: '',
        maxIterations: undefined,
      }
    } else if (nodeType === 'userApproval') {
      newNode.data = {
        ...newNode.data,
        message: 'Please approve this action',
        timeout: undefined,
      }
    } else if (nodeType === 'transform') {
      newNode.data = {
        ...newNode.data,
        expression: '',
        outputType: 'json',
      }
    } else if (nodeType === 'setState') {
      newNode.data = {
        ...newNode.data,
        variableName: '',
        value: '',
      }
    } else if (nodeType === 'note') {
      newNode.data = {
        ...newNode.data,
        content: 'Add your note here',
      }
    } else if (nodeType === 'fileSearch') {
      newNode.data = {
        ...newNode.data,
        query: '',
        maxResults: undefined,
        vectorStoreId: undefined,
      }
    } else if (nodeType === 'mcp') {
      newNode.data = {
        ...newNode.data,
        serverName: '',
        toolName: '',
        parameters: {},
      }
    }

    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  const handleNodeUpdate = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    )
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, ...data } })
    }
  }, [setNodes, selectedNode])

  const handleNodeDelete = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find((n) => n.id === nodeId)
    // Prevent deletion of default Start and End nodes
    if (nodeToDelete?.data?.isDefault || nodeToDelete?.type === 'start' || nodeToDelete?.type === 'end') {
      return
    }
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    setSelectedNode(null)
  }, [setNodes, setEdges, nodes])

  // Keyboard shortcut for delete
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNode && !isInput) {
        // Prevent deletion of default Start and End nodes
        const isDefaultNode = selectedNode.data?.isDefault || selectedNode.type === 'start' || selectedNode.type === 'end'
        if (!isDefaultNode) {
          event.preventDefault()
          handleNodeDelete(selectedNode.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, handleNodeDelete])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow') as NodeType
      if (!type || !reactFlowWrapper.current) {
        return
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      handleAddNode(type, position)
    },
    [handleAddNode]
  )

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      <div className="flex-1 flex flex-col">
        <TopBar
          workflowName={workflowName}
          workflowStatus={workflowStatus}
          onNameChange={setWorkflowName}
          onStatusChange={setWorkflowStatus}
          onPreview={() => setShowPreview(true)}
          onCode={() => setShowCode(true)}
          onDeploy={() => setWorkflowStatus('production')}
        />
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            className="bg-black"
            defaultEdgeOptions={{
              style: { stroke: '#6b7280', strokeWidth: 2 },
              type: 'default',
            }}
          >
            <Background 
              color="#1a1a1a" 
              gap={20}
              size={1}
              variant={BackgroundVariant.Dots}
            />
            <Panel position="bottom-center" className="!bottom-5 !left-1/2 !transform !-translate-x-1/2">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-2 py-1.5 shadow-lg flex items-center justify-center gap-1">
                <Controls showInteractive={false} />
              </div>
            </Panel>
          </ReactFlow>
          
          {/* Floating Sidebar - Top Left Corner */}
          <div className="absolute top-0 left-0 w-[20%] h-[85%] z-10 pointer-events-none">
            <div className="pointer-events-auto h-full">
              <NodePalette onAddNode={handleAddNode} />
            </div>
          </div>
          
          {/* Floating Config Panel - Top Right, 5% from bottom */}
          {selectedNode && (
            <div className="absolute top-14 right-0 bottom-[5%] z-20 flex flex-col justify-end">
              <NodeConfigPanel
                node={selectedNode}
                onUpdate={handleNodeUpdate}
                onDelete={handleNodeDelete}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  )
}
