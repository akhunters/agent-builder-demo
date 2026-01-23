'use client'

import { useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'

interface CenterFlowProps {
  zoom?: number
  nodesCount?: number
}

export default function CenterFlow({ zoom = 0.8, nodesCount = 0 }: CenterFlowProps) {
  const { fitView, getNodes, getViewport, setViewport } = useReactFlow()
  const hasCentered = useRef(false)
  const prevNodesCount = useRef(0)

  useEffect(() => {
    // Reset when nodes count changes significantly (new workflow loaded)
    if (prevNodesCount.current !== nodesCount && prevNodesCount.current > 0) {
      hasCentered.current = false
      prevNodesCount.current = nodesCount
    } else if (prevNodesCount.current === 0) {
      prevNodesCount.current = nodesCount
    }
    
    // Skip if already centered (to prevent re-centering on every render)
    if (hasCentered.current) return
    
    const nodes = getNodes()
    if (nodes.length > 0) {
      // Small delay to ensure ReactFlow is fully initialized, but only if onInit didn't run
      const timer = setTimeout(() => {
        // Calculate bounding box of all nodes
        const minX = Math.min(...nodes.map(n => n.position.x))
        const maxX = Math.max(...nodes.map(n => n.position.x + (n.width || 200)))
        const minY = Math.min(...nodes.map(n => n.position.y))
        const maxY = Math.max(...nodes.map(n => n.position.y + (n.height || 100)))
        
        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        // Calculate position to center nodes at specified zoom
        const x = viewportWidth / 2 - centerX * zoom
        const y = viewportHeight / 2 - centerY * zoom
        
        // Set viewport with calculated position and zoom
        setViewport(
          {
            x: x,
            y: y,
            zoom: zoom,
          },
          { duration: 0 }
        )
        
        hasCentered.current = true
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [fitView, getNodes, getViewport, setViewport, zoom, nodesCount])

  return null
}
