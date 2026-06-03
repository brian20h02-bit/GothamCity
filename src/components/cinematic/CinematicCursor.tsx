import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'
import {
  parseInteractionHint,
  type InteractionHint,
} from '@/core/interaction/contextualLabels'

interface CursorState {
  x: number
  y: number
  active: boolean
  hint: InteractionHint | null
}

const FADE = 0.15

export default function CinematicCursor() {
  const { transition } = useScene()
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    active: false,
    hint: null,
  })
  const rafRef = useRef<number>(0)
  const rawPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY }
    }

    const onHotspotEnter = (e: Event) => {
      const hint = parseInteractionHint((e as CustomEvent).detail)
      if (hint) {
        setCursor(prev => ({ ...prev, active: true, hint }))
      }
    }
    const onHotspotLeave = () => {
      setCursor(prev => ({ ...prev, active: false, hint: null }))
    }

    const loop = () => {
      setCursor(prev => ({
        ...prev,
        x: rawPos.current.x,
        y: rawPos.current.y,
      }))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('hotspot-enter', onHotspotEnter)
    window.addEventListener('hotspot-leave', onHotspotLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('hotspot-enter', onHotspotEnter)
      window.removeEventListener('hotspot-leave', onHotspotLeave)
    }
  }, [])

  const loading = transition.active
  const interactive = loading || cursor.active
  const glowColor = loading
    ? 'rgba(229,229,229,0.2)'
    : cursor.active
      ? 'rgba(229,229,229,0.45)'
      : 'rgba(229,229,229,0.25)'

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          top: cursor.y,
          left: cursor.x,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: interactive ? `0 0 12px ${glowColor}` : 'none',
        }}
        animate={{
          width: interactive ? 28 : 20,
          height: interactive ? 28 : 20,
          border: `1px solid ${interactive ? 'rgba(229,229,229,0.5)' : 'rgba(229,229,229,0.28)'}`,
          opacity: loading ? 0.45 : 0.9,
        }}
        transition={{ duration: FADE, ease: 'easeOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          top: cursor.y,
          left: cursor.x,
          translateX: '-50%',
          translateY: '-50%',
          background: 'rgba(229,229,229,0.85)',
        }}
        animate={{
          width: interactive ? 3 : 2,
          height: interactive ? 3 : 2,
        }}
        transition={{ duration: FADE, ease: 'easeOut' }}
      />

      <AnimatePresence>
        {loading && (
          <motion.span
            key="loading"
            className="fixed pointer-events-none z-[9999] font-body"
            style={{
              top: cursor.y + 22,
              left: cursor.x,
              translateX: '-50%',
              fontSize: 7,
              letterSpacing: '3px',
              color: 'rgba(229,229,229,0.4)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE }}
          >
            LOADING
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )
}
