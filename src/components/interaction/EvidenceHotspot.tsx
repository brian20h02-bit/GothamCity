import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import type { InteractionHint } from '@/core/interaction/contextualLabels'
import {
  dispatchInteractionEnter,
  dispatchInteractionLeave,
} from '@/core/interaction/contextualLabels'
import { useInteractionDebug } from '@/core/interaction/InteractionDebugContext'
import { INTERACTION_PRIORITY } from '@/core/interaction/types'
import ContextualLabel from './ContextualLabel'
import { getHitAreaStyle, type HitAreaProps } from './hotspotGeometry'

interface Props extends HitAreaProps {
  hint:           InteractionHint
  onCollect:      () => void
  disabled?:      boolean
  detectiveOn:    boolean
  ariaLabel:      string
  debugId?:       string
  elementHint?:   string
}

/**
 * Pista investigable — SOLO visible con Detective Mode ON.
 * Nunca navega. Glow verde + pulso lento.
 */
export default function EvidenceHotspot({
  hint,
  onCollect,
  disabled = false,
  detectiveOn,
  ariaLabel,
  debugId,
  elementHint,
  ...area
}: Props) {
  const [hovered, setHovered] = useState(false)
  const { enabled: debugOn } = useInteractionDebug()

  const handleEnter = useCallback(() => {
    if (disabled || !detectiveOn) return
    setHovered(true)
    dispatchInteractionEnter(hint)
  }, [disabled, detectiveOn, hint])

  const handleLeave = useCallback(() => {
    setHovered(false)
    dispatchInteractionLeave()
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !detectiveOn) return
      e.stopPropagation()
      onCollect()
    },
    [disabled, detectiveOn, onCollect],
  )

  if (!detectiveOn) return null

  return (
    <button
      type="button"
      className="absolute"
      disabled={disabled}
      style={{
        ...getHitAreaStyle(area),
        background: 'transparent',
        border: 'none',
        cursor: 'none',
        zIndex: INTERACTION_PRIORITY.EVIDENCE,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-hotspot-kind="evidence"
      title={elementHint}
    >
      {debugOn && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ border: '2px dashed rgba(100,220,160,0.7)', background: 'rgba(100,220,160,0.08)' }}
          title={debugId}
        />
      )}

      {/* Marcador verde detective — pulso + scan */}
      <motion.span
        className="absolute pointer-events-none rounded-sm"
        style={{
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          width: hovered ? 14 : 10,
          height: hovered ? 14 : 10,
          border: '1px solid rgba(100,220,160,0.65)',
          background: 'rgba(100,220,160,0.12)',
          boxShadow: hovered
            ? '0 0 18px rgba(100,220,160,0.5), inset 0 0 8px rgba(100,220,160,0.15)'
            : '0 0 10px rgba(100,220,160,0.3)',
        }}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      {/* Línea de scan horizontal */}
      {!hovered && (
        <motion.span
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: 'rgba(100,220,160,0.35)', top: '50%' }}
          animate={{ opacity: [0, 0.8, 0], scaleX: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      )}

      <ContextualLabel visible={hovered && !disabled} hint={hint} variant="evidence" />
    </button>
  )
}
