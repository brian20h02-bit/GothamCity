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
  hint:        InteractionHint
  onNavigate:  () => void
  disabled?:   boolean
  ariaLabel:   string
  debugId?:    string
  elementHint?: string
}

/** Navegación entre escenas — siempre visible, marcador blanco, nunca verde detective */
export default function NavigationHotspot({
  hint,
  onNavigate,
  disabled = false,
  ariaLabel,
  debugId,
  elementHint,
  ...area
}: Props) {
  const [hovered, setHovered] = useState(false)
  const { enabled: debugOn } = useInteractionDebug()

  const handleEnter = useCallback(() => {
    if (disabled) return
    setHovered(true)
    dispatchInteractionEnter(hint)
  }, [disabled, hint])

  const handleLeave = useCallback(() => {
    setHovered(false)
    dispatchInteractionLeave()
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return
      e.stopPropagation()
      onNavigate()
    },
    [disabled, onNavigate],
  )

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
        zIndex: INTERACTION_PRIORITY.NAVIGATION,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-hotspot-kind="navigation"
      title={elementHint}
    >
      {debugOn && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ border: '2px dashed rgba(220,175,90,0.75)', background: 'rgba(220,175,90,0.1)' }}
          title={debugId}
        />
      )}

      {/* Marcador blanco — siempre visible, sutil */}
      <motion.span
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          background: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
          boxShadow: hovered
            ? '0 0 14px rgba(255,255,255,0.45)'
            : '0 0 6px rgba(255,255,255,0.2)',
        }}
        animate={{ width: hovered ? 8 : 5, height: hovered ? 8 : 5 }}
        transition={{ duration: 0.15 }}
        aria-hidden
      />

      <ContextualLabel visible={hovered && !disabled} hint={hint} variant="navigation" />
    </button>
  )
}
