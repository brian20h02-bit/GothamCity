import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import type { TrailMarkerType } from '@/data/sceneInvestigations'
import {
  buildAnalyzeHint,
  dispatchInteractionEnter,
  dispatchInteractionLeave,
} from '@/core/interaction/contextualLabels'
import ContextualLabel from '@/components/interaction/ContextualLabel'
import { INTERACTION_PRIORITY } from '@/core/interaction/types'

interface Props {
  top:      number
  left:     number
  type:     TrailMarkerType
  hint?:    string
  active:   boolean
  visited:  boolean
  onFollow: () => void
  element?: string
}

/**
 * Rastro de investigación — usa estilo EvidenceHotspot (verde detective).
 * Solo interactivo en paso activo del trail.
 */
export default function TrailMarker({
  top,
  left,
  hint,
  active,
  visited,
  onFollow,
  element,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const label = hint ?? element ?? 'Trace'
  const interactionHint = buildAnalyzeHint(label)

  const handleEnter = useCallback(() => {
    if (!active || visited) return
    setHovered(true)
    dispatchInteractionEnter(interactionHint)
  }, [active, visited, interactionHint])

  const handleLeave = useCallback(() => {
    setHovered(false)
    dispatchInteractionLeave()
  }, [])

  if (visited) return null

  return (
    <button
      type="button"
      className="absolute pointer-events-auto"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: 'translate(-50%, -50%)',
        width: '8%',
        height: '10%',
        minWidth: 48,
        minHeight: 48,
        maxWidth: 72,
        maxHeight: 72,
        background: 'transparent',
        border: 'none',
        cursor: active ? 'none' : 'default',
        zIndex: INTERACTION_PRIORITY.EVIDENCE,
        pointerEvents: active ? 'auto' : 'none',
      }}
      onClick={e => {
        e.stopPropagation()
        if (active) onFollow()
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      aria-label={element ?? hint ?? 'Analyze'}
      data-hotspot-kind="evidence"
      title={element}
    >
      <motion.span
        className="absolute pointer-events-none rounded-sm"
        style={{
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          width: active ? (hovered ? 14 : 10) : 8,
          height: active ? (hovered ? 14 : 10) : 8,
          border: `1px solid rgba(100,220,160,${active ? 0.65 : 0.25})`,
          background: `rgba(100,220,160,${active ? 0.12 : 0.04})`,
          boxShadow: active
            ? '0 0 12px rgba(100,220,160,0.35)'
            : '0 0 6px rgba(100,220,160,0.15)',
        }}
        animate={active ? { opacity: [0.65, 1, 0.65] } : { opacity: 0.35 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      <ContextualLabel visible={hovered && active} hint={interactionHint} variant="evidence" />
    </button>
  )
}
