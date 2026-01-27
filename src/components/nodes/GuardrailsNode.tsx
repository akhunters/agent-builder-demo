'use client'

import { Handle, Position } from '@xyflow/react'
import { Shield } from 'lucide-react'

export default function GuardrailsNode({ data }: { data: any }) {
  // Check for Non-Pass failure guardrails (PII and Hallucination)
  const hasPII = data.pii === true
  const hasHallucination = data.hallucination === true
  const hasNonPassFailureGuardrail = hasPII || hasHallucination
  
  // Determine which Pass-Failure guardrails are enabled
  const enabledPassFailureGuardrails: Array<{ key: string; label: string }> = []
  
  if (data.moderation && data.moderation !== 'off') {
    enabledPassFailureGuardrails.push({ key: 'moderation', label: 'Moderation' })
  }
  if (data.jailbreak) {
    enabledPassFailureGuardrails.push({ key: 'jailbreak', label: 'Jailbreak' })
  }
  if (data.nsfwText) {
    enabledPassFailureGuardrails.push({ key: 'nsfwText', label: 'NSFW Text' })
  }
  if (data.urlFilter) {
    enabledPassFailureGuardrails.push({ key: 'urlFilter', label: 'URL Filter' })
  }
  if (data.promptInjectionDetection) {
    enabledPassFailureGuardrails.push({ key: 'promptInjectionDetection', label: 'Prompt Injection Detection' })
  }
  if (data.customPromptCheck) {
    enabledPassFailureGuardrails.push({ key: 'customPromptCheck', label: 'Custom Prompt Check' })
  }

  const continueOnError = data.continueOnError === true
  const hasOnlyNonPassFailure = hasNonPassFailureGuardrail && enabledPassFailureGuardrails.length === 0
  const hasPassFailureGuardrail = enabledPassFailureGuardrails.length > 0

  // Determine which handles to show based on the cases
  let handlesToShow: Array<{ id: string; label: string }> = []

  if (hasOnlyNonPassFailure) {
    // Case 1: Non-Pass failure guardrail without continue on error → single handle
    // Case 2: Non-Pass failure guardrail with continue on error → Pass, Error
    if (continueOnError) {
      handlesToShow = [
        { id: 'pass', label: 'Pass' },
        { id: 'error', label: 'Error' }
      ]
    } else {
      handlesToShow = [
        { id: 'output', label: 'Output' }
      ]
    }
  } else if (hasPassFailureGuardrail) {
    // Case 3: Any one Pass-Failure guardrail without continue on error → Pass, Fail
    // Case 4: Any one Pass-Failure guardrail with continue on error → Pass, Fail, Error
    handlesToShow = [
      { id: 'pass', label: 'Pass' },
      { id: 'fail', label: 'Fail' }
    ]
    if (continueOnError) {
      handlesToShow.push({ id: 'error', label: 'Error' })
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg border border-[#3a3a3a]/50 min-w-[180px] ring-1 ring-white/5">
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#eab308] flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white font-medium text-sm">{data.name || data.label || 'Guardrails'}</span>
      </div>

      {/* Body with handle chips */}
      {handlesToShow.length > 0 && (
        <div className="px-3 py-2.5 space-y-2">
          {handlesToShow.map((handle, index) => (
            <div key={handle.id} className="relative">
              <div className="bg-[#2a2a2a] rounded-md px-3 py-2">
                <span className="text-white text-sm">{handle.label}</span>
              </div>
              <Handle 
                type="source" 
                position={Position.Right} 
                id={handle.id}
                className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !right-[-6px]"
                style={{ top: '50%' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Input handle on the left - positioned at header level */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[#6b7280] !border-[#1a1a1a] !w-2 !h-2 !left-[-6px]"
        style={{ top: '20px' }}
      />
    </div>
  )
}
