'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface MenuProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right' | 'center'
  side?: 'top' | 'bottom'
  className?: string
}

export default function Menu({ trigger, children, align = 'right', side = 'bottom', className = '' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current || !menuRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const menuRect = menuRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let left = 0
        let top = 0

        // Horizontal alignment
        if (align === 'right') {
          left = triggerRect.right - menuRect.width
        } else if (align === 'left') {
          left = triggerRect.left
        } else {
          // center
          left = triggerRect.left + (triggerRect.width / 2) - (menuRect.width / 2)
        }

        // Vertical positioning
        if (side === 'bottom') {
          top = triggerRect.bottom + 4
        } else {
          top = triggerRect.top - menuRect.height - 4
        }

        // Ensure menu stays within viewport
        if (left < 8) left = 8
        if (left + menuRect.width > viewportWidth - 8) {
          left = viewportWidth - menuRect.width - 8
        }
        if (top < 8) top = 8
        if (top + menuRect.height > viewportHeight - 8) {
          top = viewportHeight - menuRect.height - 8
        }

        setPosition({ top, left })
      }

      // Use requestAnimationFrame to ensure menu is rendered before calculating position
      requestAnimationFrame(() => {
        updatePosition()
      })

      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)

      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  }, [isOpen, align, side])

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          menuRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  const handleMenuClick = (e: React.MouseEvent) => {
    // Close menu when clicking on menu items (buttons, links, etc.)
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      setIsOpen(false)
    }
  }

  const menu = isOpen && typeof window !== 'undefined' && (
    <div
      ref={menuRef}
      onClick={handleMenuClick}
      className={`fixed z-[9999] bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg overflow-hidden min-w-[192px] ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  )

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && typeof window !== 'undefined' && createPortal(menu, document.body)}
    </>
  )
}
