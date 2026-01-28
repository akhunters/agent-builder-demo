'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useReactFlow } from '@xyflow/react'
import { StartNodeStateVariable } from '@/types'
import VariableForm from './VariableForm'

interface VariableFormPopupProps {
  isOpen: boolean
  nodeId: string
  variable: StartNodeStateVariable | null
  onSave: (variable: StartNodeStateVariable) => void
  onCancel: () => void
  existingVariables?: StartNodeStateVariable[]
}

export default function VariableFormPopup({
  isOpen,
  nodeId,
  variable,
  onSave,
  onCancel,
  existingVariables = [],
}: VariableFormPopupProps) {
  const { getNode, getViewport } = useReactFlow()
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hasBeenDragged, setHasBeenDragged] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && nodeId && !isDragging && !hasBeenDragged) {
      const updatePosition = () => {
        // Skip auto-positioning if user has manually dragged the popup
        if (hasBeenDragged || isDragging) return

        // Try to find the NodeConfigPanel first
        const configPanel = document.querySelector('[data-node-config-panel]') as HTMLElement
        if (!popupRef.current) return

        const popupRect = popupRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let left = 0
        let top = 0

        if (configPanel) {
          // Position to the left of the config panel
          const configRect = configPanel.getBoundingClientRect()
          left = configRect.left - popupRect.width - 16 // 16px gap
          top = configRect.top
        } else {
          // Fallback: position relative to the node
          const nodeElement = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement
          if (!nodeElement) return

          const nodeRect = nodeElement.getBoundingClientRect()
          // Position to the left of the node
          left = nodeRect.left - popupRect.width - 16 // 16px gap
          top = nodeRect.top
        }

        // Ensure popup stays within viewport
        if (left < 8) {
          left = 8 // Keep on left side, just adjust to viewport edge
        }
        if (left + popupRect.width > viewportWidth - 8) {
          left = viewportWidth - popupRect.width - 8
        }
        if (top < 8) {
          top = 8
        }
        if (top + popupRect.height > viewportHeight - 8) {
          top = viewportHeight - popupRect.height - 8
        }

        setPosition({ top, left })
      }

      // Initial position calculation - use double RAF to ensure DOM is ready
      let rafId1 = requestAnimationFrame(() => {
        let rafId2 = requestAnimationFrame(() => {
          updatePosition()
        })
      })

      // Listen to window events
      window.addEventListener('resize', updatePosition)
      
      // Listen to React Flow viewport changes (pan/zoom)
      const reactFlowViewport = document.querySelector('.react-flow__viewport')
      if (reactFlowViewport) {
        reactFlowViewport.addEventListener('scroll', updatePosition, true)
        reactFlowViewport.addEventListener('wheel', updatePosition, { passive: true })
      }

      // Listen to React Flow transform changes (pan/zoom via transform)
      const reactFlowPane = document.querySelector('.react-flow__pane')
      if (reactFlowPane) {
        reactFlowPane.addEventListener('wheel', updatePosition, { passive: true })
      }

      // Use IntersectionObserver to detect when node moves in/out of viewport
      const intersectionObserver = new IntersectionObserver(
        () => {
          updatePosition()
        },
        { threshold: 0 }
      )

      const nodeElement = document.querySelector(`[data-id="${nodeId}"]`)
      if (nodeElement) {
        intersectionObserver.observe(nodeElement)
      }

      return () => {
        if (rafId1) cancelAnimationFrame(rafId1)
        window.removeEventListener('resize', updatePosition)
        if (reactFlowViewport) {
          reactFlowViewport.removeEventListener('scroll', updatePosition, true)
          reactFlowViewport.removeEventListener('wheel', updatePosition)
        }
        if (reactFlowPane) {
          reactFlowPane.removeEventListener('wheel', updatePosition)
        }
        intersectionObserver.disconnect()
      }
    }
  }, [isOpen, nodeId, getViewport, isDragging, hasBeenDragged])

  // Drag handlers
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newLeft = e.clientX - dragOffset.x
      const newTop = e.clientY - dragOffset.y
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Keep popup within viewport bounds
      let left = newLeft
      let top = newTop

      if (popupRef.current) {
        const popupRect = popupRef.current.getBoundingClientRect()
        if (left < 0) left = 0
        if (left + popupRect.width > viewportWidth) {
          left = viewportWidth - popupRect.width
        }
        if (top < 0) top = 0
        if (top + popupRect.height > viewportHeight) {
          top = viewportHeight - popupRect.height
        }
      }

      setPosition({ top, left })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setHasBeenDragged(true)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleDragStart = (e: React.MouseEvent) => {
    // Don't start drag if clicking on the close button
    const target = e.target as HTMLElement
    if (target.closest('button')) return

    if (!popupRef.current) return
    const popupRect = popupRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - popupRect.left,
      y: e.clientY - popupRect.top,
    })
    setIsDragging(true)
    e.preventDefault()
  }

  // Reset hasBeenDragged when popup closes or node changes
  useEffect(() => {
    if (!isOpen) {
      setHasBeenDragged(false)
    }
  }, [isOpen, nodeId])

  useEffect(() => {
    if (isOpen && !isDragging) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popupRef.current &&
          !popupRef.current.contains(event.target as Node)
        ) {
          // Don't close if clicking on the trigger button or menu
          const target = event.target as HTMLElement
          if (!target.closest('[data-variable-form-trigger]')) {
            onCancel()
          }
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onCancel()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onCancel, isDragging])

  if (!isOpen || typeof window === 'undefined') return null

  const popup = (
    <div
      ref={popupRef}
      className="fixed z-[10000] bg-transparent rounded-lg w-96 max-w-[calc(100vw-32px)]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <VariableForm
        variable={variable}
        onSave={onSave}
        onCancel={onCancel}
        existingVariables={existingVariables}
        onHeaderMouseDown={handleDragStart}
      />
    </div>
  )

  return createPortal(popup, document.body)
}
