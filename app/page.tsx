'use client'

import { useState, useCallback, useRef } from 'react'
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
  MiniMap,
  ReactFlowProvider,
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

const nodeTypes = {
  start: StartNode,
  agent: AgentNode,
  end: EndNode,
  guardrails: GuardrailsNode,
  ifElse: IfElseNode,
  note: NoteNode,
  mcp: MCPNode,
  fileSearch: FileSearchNode,
}

function FlowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'start-1',
      type: 'start',
      position: { x: 250, y: 100 },
      data: { label: 'Start' },
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
        conditions: [{ expression: '' }],
      }
    } else if (nodeType === 'note') {
      newNode.data = {
        ...newNode.data,
        content: 'Add your note here',
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
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <NodePalette onAddNode={handleAddNode} />
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
            className="bg-[#0a0a0a]"
          >
            <Background color="#1a1a1a" gap={20} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onUpdate={handleNodeUpdate}
          onClose={() => setSelectedNode(null)}
        />
      )}
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
