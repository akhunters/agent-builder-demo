import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodePalette from '@/components/NodePalette'
import NodeConfigPanel from '@/components/NodeConfigPanel'
import EdgeConfigPanel from '@/components/EdgeConfigPanel'
import TopBar from '@/components/TopBar'
import WorkflowSidebar from '@/components/WorkflowSidebar'
import CenterFlow from '@/components/CenterFlow'
import { useWorkflowStore } from '@/lib/store'
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
import ClassifyNode from '@/components/nodes/ClassifyNode'

const VALID_NODE_TYPES: NodeType[] = [
  'start',
  'agent',
  'end',
  'note',
  'fileSearch',
  'guardrails',
  'mcp',
  'ifElse',
  'while',
  'userApproval',
  'transform',
  'setState',
  'classify',
]

const isValidNodeType = (t: unknown): t is NodeType =>
  typeof t === 'string' && (VALID_NODE_TYPES as readonly string[]).includes(t)

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
  classify: ClassifyNode,
}

function FlowEditor() {
  const params = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const workflowId = params.id as string
  const isViewMode = searchParams.get('view') === 'true'
  const { getWorkflow, updateWorkflow, loadWorkflows, workflows } = useWorkflowStore()
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [workflowStatus, setWorkflowStatus] = useState<'draft' | 'production'>('draft')
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load workflows from storage on mount
  useEffect(() => {
    loadWorkflows()
    // Small delay to ensure workflows are loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [loadWorkflows])

  // Load workflow from store - re-check when workflows change
  const workflow = getWorkflow(workflowId)
  const isTemplate = workflow?.isTemplate === true

  useEffect(() => {
    if (workflow) {
      console.log('Workflow loaded:', workflow.id, workflow.name)
    } else if (workflowId && !isLoading) {
      console.warn('Workflow not found after loading:', workflowId)
      console.log('Available workflow IDs:', workflows.map(w => w.id))
    }
  }, [workflow, workflowId, isLoading, workflows])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow?.nodes || [
      {
        id: 'start-default',
        type: 'start',
        position: { x: 100, y: 200 },
        data: { 
          label: 'Start', 
          isDefault: true,
          inputVariables: [{ name: 'input_as_text', type: 'string' }],
          stateVariables: [],
        },
      },
      {
        id: 'end-default',
        type: 'end',
        position: { x: 300, y: 200 },
        data: { label: 'End', isDefault: true },
      },
    ]
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.edges || [])

  // Memoize nodes and edges with selected state
  const nodesWithSelection = useMemo(() => {
    return nodes.map(node => {
      const isSelected = selectedNode?.id === node.id
      return {
        ...node,
        selected: isSelected,
        className: isSelected ? `${node.className || ''} node-selected`.trim() : node.className
      }
    })
  }, [nodes, selectedNode])

  const edgesWithSelection = useMemo(() => {
    return edges.map(edge => {
      const isSelected = selectedEdge?.id === edge.id
      return {
        ...edge,
        selected: isSelected,
        className: isSelected ? `${edge.className || ''} edge-selected`.trim() : edge.className
      }
    })
  }, [edges, selectedEdge])
  const reactFlowInstance = useRef<any>(null)
  const hasInitialized = useRef(false)

  // Initialize from workflow
  useEffect(() => {
    if (workflow) {
      setWorkflowName(workflow.name)
      setWorkflowStatus(workflow.status)
    }
  }, [workflow])

  // Auto-save workflow (skip if viewing template)
  useEffect(() => {
    if (workflowId && workflow && !isViewMode && !isTemplate) {
      const saveTimeout = setTimeout(() => {
        updateWorkflow(workflowId, {
          name: workflowName,
          status: workflowStatus,
          nodes: nodes as WorkflowNode[],
          edges,
        })
      }, 1000)

      return () => clearTimeout(saveTimeout)
    }
  }, [workflowName, workflowStatus, nodes, edges, workflowId, updateWorkflow, isViewMode, isTemplate, workflow])

  // Load nodes from workflow when workflow is first loaded or workflow ID changes
  useEffect(() => {
    if (workflow && workflow.nodes && workflow.nodes.length > 0) {
      // Check if nodes need to be updated (different workflow or nodes not loaded)
      const currentNodes = nodes
      const shouldUpdate = 
        currentNodes.length === 0 || 
        currentNodes[0]?.id !== workflow.nodes[0]?.id ||
        currentNodes[0]?.position?.x !== workflow.nodes[0]?.position?.x ||
        currentNodes[0]?.position?.y !== workflow.nodes[0]?.position?.y
      
      if (shouldUpdate) {
        const hydratedNodes: WorkflowNode[] = (workflow.nodes as unknown[]).map((n: any) => {
          const nodeType: NodeType = isValidNodeType(n?.type) ? n.type : 'agent'
          return {
            ...n,
            type: nodeType,
            data: {
              ...(n?.data || {}),
              label: (n?.data?.label as string) || (typeof n?.label === 'string' ? n.label : nodeType),
            },
          } as WorkflowNode
        })

        setNodes(hydratedNodes)
      }
    }
  }, [workflow?.id, workflow?.nodes]) // Update when workflow ID or nodes change

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }, [])

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  const handleAddNode = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      // Prevent adding nodes in view mode
      if (isViewMode || isTemplate) return
      const newNode: WorkflowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1) },
      }

      if (nodeType === 'agent') {
        newNode.data = {
          ...newNode.data,
          name: 'Agent',
          instructions: '',
          model: 'gpt-5',
          reasoning: 'minimum',
          includeChatHistory: true,
          outputFormat: 'text',
          verbosity: 'low',
          summary: 'null',
          tools: [],
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
      } else if (nodeType === 'classify') {
        newNode.data = {
          ...newNode.data,
          name: 'Classify',
          input: 'input_as_text',
          inputType: 'STRING',
          categories: [],
          classifier: 'gpt-4.1',
          examples: [
            { input: '', category: '' },
          ],
        }
      }

      setNodes((nds) => [...nds, newNode])
    },
    [setNodes]
  )

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: any) => {
      // Prevent updates in view mode
      if (isViewMode || isTemplate) return
      
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        )
      )
      if (selectedNode?.id === nodeId) {
        setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, ...data } })
      }
    },
    [setNodes, selectedNode, isViewMode, isTemplate]
  )

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      // Prevent deletion in view mode
      if (isViewMode || isTemplate) return
      
      const nodeToDelete = nodes.find((n) => n.id === nodeId)
      if (nodeToDelete?.data?.isDefault || nodeToDelete?.type === 'start') {
        return
      }
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      setSelectedNode(null)
      setSelectedEdge(null)
    },
    [setNodes, setEdges, nodes, isViewMode, isTemplate]
  )

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      // Prevent deletion in view mode
      if (isViewMode || isTemplate) return
      
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
      setSelectedEdge(null)
    },
    [setEdges, isViewMode, isTemplate]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNode && !isInput) {
        const isDefaultNode = selectedNode.data?.isDefault || selectedNode.type === 'start'
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-xl">Loading workflow...</p>
        </div>
      </div>
    )
  }

  if (!workflow && workflowId !== 'new') {
    console.error('Workflow not found:', workflowId)
    console.log('Available workflows:', useWorkflowStore.getState().workflows.map(w => w.id))
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-xl mb-2">Workflow not found</p>
          <p className="text-sm text-[#6b7280] mb-4">ID: {workflowId}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#3b82f6] rounded-md hover:bg-[#2563eb]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden relative">
      {/* Workflow Sidebar */}
      {showSidebar && (
        <div className="absolute left-0 top-0 bottom-0 z-30">
          <WorkflowSidebar currentWorkflowId={workflowId} onClose={() => setShowSidebar(false)} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <TopBar
          workflowName={workflowName}
          workflowStatus={workflowStatus}
          onNameChange={isViewMode || isTemplate ? undefined : setWorkflowName}
          onStatusChange={isViewMode || isTemplate ? undefined : setWorkflowStatus}
          onPreview={() => setShowPreview(true)}
          onCode={() => setShowCode(true)}
          onDeploy={isViewMode || isTemplate ? undefined : () => setWorkflowStatus('production')}
          isReadOnly={isViewMode || isTemplate}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodesWithSelection}
            edges={edgesWithSelection}
            nodeTypes={nodeTypes}
            onNodesChange={(changes) => {
              onNodesChange(changes)
              // Force re-render to update selection
              setNodes((nds) => nds)
            }}
            onEdgesChange={(changes) => {
              onEdgesChange(changes)
              // Force re-render to update selection
              setEdges((eds) => eds)
            }}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={(instance) => {
              reactFlowInstance.current = instance
              // Calculate and set initial viewport immediately to prevent jitter
              if (nodes.length > 0 && !hasInitialized.current) {
                const zoom = 0.8
                const minX = Math.min(...nodes.map(n => n.position.x))
                const maxX = Math.max(...nodes.map(n => n.position.x + (n.width || 200)))
                const minY = Math.min(...nodes.map(n => n.position.y))
                const maxY = Math.max(...nodes.map(n => n.position.y + (n.height || 100)))
                
                const centerX = (minX + maxX) / 2
                const centerY = (minY + maxY) / 2
                
                const viewportWidth = window.innerWidth
                const viewportHeight = window.innerHeight
                
                const x = viewportWidth / 2 - centerX * zoom
                const y = viewportHeight / 2 - centerY * zoom
                
                instance.setViewport({ x, y, zoom }, { duration: 0 })
                hasInitialized.current = true
              }
            }}
            className="bg-[#072447]"
            defaultEdgeOptions={{
              style: { stroke: '#6b7280', strokeWidth: 2 },
              type: 'default',
            }}
          >
            <Background color="rgba(255, 255, 255, 0.25)" gap={20} size={1} variant={BackgroundVariant.Dots} />
            <CenterFlow zoom={0.8} nodesCount={nodes.length} />
            <Panel position="bottom-center" className="!bottom-5 !left-1/2 !transform !-translate-x-1/2">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-2 py-1.5 shadow-lg flex items-center justify-center gap-1">
                <Controls showInteractive={false} />
              </div>
            </Panel>
          </ReactFlow>

          {!isViewMode && !isTemplate && (
            <div className={`absolute top-0 ${showSidebar ? 'left-80' : 'left-0'} w-[20%] h-[85%] z-10 pointer-events-none transition-all duration-300`}>
              <div className="pointer-events-auto h-full">
                <NodePalette onAddNode={handleAddNode} />
              </div>
            </div>
          )}
          
          {(isViewMode || isTemplate) && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2">
              <p className="text-sm text-white">
                {isTemplate ? 'Template View - Read Only' : 'View Mode - Read Only'}
              </p>
            </div>
          )}

          {selectedNode && typeof window !== 'undefined' && createPortal(
            <div className="fixed top-14 right-0 z-20">
              <NodeConfigPanel
                node={selectedNode}
                nodes={nodes}
                onUpdate={handleNodeUpdate}
                onDelete={handleNodeDelete}
                onClose={() => setSelectedNode(null)}
              />
            </div>,
            document.body
          )}

          {selectedEdge && typeof window !== 'undefined' && createPortal(
            <div className="fixed top-14 right-0 z-20">
              <EdgeConfigPanel
                edge={selectedEdge}
                sourceNode={nodes.find((n) => n.id === selectedEdge.source) || null}
                targetNode={nodes.find((n) => n.id === selectedEdge.target) || null}
                onDelete={handleEdgeDelete}
                onClose={() => setSelectedEdge(null)}
              />
            </div>,
            document.body
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkflowPage() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  )
}