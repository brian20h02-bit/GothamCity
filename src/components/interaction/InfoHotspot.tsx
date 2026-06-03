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
  hint:         InteractionHint
  onOpen:       () => void
  disabled?:    boolean
  detectiveOn:  boolean
  ariaLabel:    string
  debugId?:     string
  elementHint?: string
}

/**
 * Información contextual (READ FILE) — SOLO visible con Detective Mode OFF.
 * Nunca navega ni revela evidencia.
 */
export default function InfoHotspot({
  hint,
  onOpen,
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
    if (disabled || detectiveOn) return
    setHovered(true)
    dispatchInteractionEnter(hint)
  }, [disabled, detectiveOn, hint])

  const handleLeave = useCallback(() => {
    setHovered(false)
    dispatchInteractionLeave()
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || detectiveOn) return
      e.stopPropagation()
      onOpen()
    },
    [disabled, detectiveOn, onOpen],
  )

  if (detectiveOn) return null

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
        zIndex: INTERACTION_PRIORITY.INFO,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-hotspot-kind="info"
      title={elementHint}
    >
      {debugOn && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ border: '2px dashed rgba(180,180,200,0.6)', background: 'rgba(180,180,200,0.06)' }}
          title={debugId}
        />
      )}

      {/* Sin marcador en reposo — solo feedback al hover */}
      {hovered && (
        <motion.span
          className="absolute pointer-events-none rounded-full"
          style={{
            top: '50%',
            left: '50%',
            translate: '-50% -50%',
            width: 6,
            height: 6,
            background: 'rgba(229,229,229,0.7)',
            boxShadow: '0 0 10px rgba(229,229,229,0.35)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          aria-hidden
        />
      )}

      <ContextualLabel visible={hovered && !disabled} hint={hint} variant="info" />
    </button>
  )
}
