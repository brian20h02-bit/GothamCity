import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HotspotType } from '@/core/interaction/types'
import { HOTSPOT_DEBUG_COLORS } from '@/core/interaction/types'
import type { InteractionHint } from '@/core/interaction/contextualLabels'
import {
  dispatchInteractionEnter,
  dispatchInteractionLeave,
} from '@/core/interaction/contextualLabels'
import { useInteractionDebug } from '@/core/interaction/InteractionDebugContext'

const FADE = 0.15

interface AnchoredHitTargetProps {
  top:           number
  left:          number
  hitRadius?:    number
  hitWidthPct?:  number
  hitHeightPct?: number
  hint:          InteractionHint
  hotspotType:   HotspotType
  priority:      number
  onActivate:    () => void
  disabled?:     boolean
  ariaLabel:     string
  debugId?:      string
  elementHint?:  string
  /** Detective Mode — sutil contorno en el objeto */
  detectiveReveal?: boolean
}

export default function AnchoredHitTarget({
  top,
  left,
  hitRadius = 40,
  hitWidthPct,
  hitHeightPct,
  hint,
  hotspotType,
  priority,
  onActivate,
  disabled = false,
  ariaLabel,
  debugId,
  elementHint,
  detectiveReveal = false,
}: AnchoredHitTargetProps) {
  const [hovered, setHovered] = useState(false)
  const { enabled: debugOn } = useInteractionDebug()

  const isRect = hitWidthPct != null && hitHeightPct != null
  const debugColor = HOTSPOT_DEBUG_COLORS[hotspotType]

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
      onActivate()
    },
    [disabled, onActivate],
  )

  const style: React.CSSProperties = isRect
    ? {
        top: `${top - hitHeightPct! / 2}%`,
        left: `${left - hitWidthPct! / 2}%`,
        width: `${hitWidthPct}%`,
        height: `${hitHeightPct}%`,
      }
    : {
        top: `${top}%`,
        left: `${left}%`,
        width: hitRadius * 2,
        height: hitRadius * 2,
        transform: 'translate(-50%, -50%)',
      }

  const showDetectiveOutline = detectiveReveal && !hovered && !disabled

  return (
    <button
      type="button"
      className="absolute"
      disabled={disabled}
      style={{
        ...style,
        background: 'transparent',
        border: 'none',
        cursor: 'none',
        zIndex: priority,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      data-hotspot-type={hotspotType}
      title={elementHint}
    >
      {debugOn && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `2px dashed ${debugColor}`,
            background: `${debugColor}18`,
          }}
          title={debugId ?? elementHint}
        />
      )}

      {showDetectiveOutline && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(100,220,160,0.22)',
            background: 'rgba(100,220,160,0.04)',
          }}
          aria-hidden
        />
      )}

      <AnimatePresence>
        {hovered && !disabled && (
          <motion.span
            key="ctx-label"
            className="absolute font-body pointer-events-none text-center"
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 10,
              minWidth: 120,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE }}
          >
            <span
              className="block"
              style={{
                fontSize: 7,
                letterSpacing: '2.5px',
                color: 'rgba(229,229,229,0.55)',
                marginBottom: 4,
              }}
            >
              {hint.actionLine}
            </span>
            <span
              className="block font-display"
              style={{
                fontSize: 9,
                letterSpacing: '2px',
                color: 'rgba(229,229,229,0.88)',
              }}
            >
              {hint.targetLine}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
