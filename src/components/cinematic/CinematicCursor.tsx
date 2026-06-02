import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CursorState {
  x: number
  y: number
  hotspot: boolean
  label: string
}

/**
 * CinematicCursor — replaces the default OS cursor on the scene explorer.
 * Call `window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: 'INVESTIGATE' }))` 
 * from hotspot components to trigger the expanded state.
 */
export default function CinematicCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    hotspot: false,
    label: '',
  })
  const rafRef = useRef<number>(0)
  const rawPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY }
    }

    const onHotspotEnter = (e: Event) => {
      const label = (e as CustomEvent<string>).detail ?? ''
      setCursor(prev => ({ ...prev, hotspot: true, label }))
    }
    const onHotspotLeave = () => {
      setCursor(prev => ({ ...prev, hotspot: false, label: '' }))
    }

    // Smooth cursor follow via RAF
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

  return (
    <>
      {/* Hide native cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* ── Outer ring ──────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          top:  cursor.y,
          left: cursor.x,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width:   cursor.hotspot ? 54 : 24,
          height:  cursor.hotspot ? 54 : 24,
          border:  cursor.hotspot
            ? '1px solid rgba(229,229,229,0.55)'
            : '1px solid rgba(229,229,229,0.35)',
          opacity: 0.85,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Inner dot ───────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          top:       cursor.y,
          left:      cursor.x,
          translateX: '-50%',
          translateY: '-50%',
          background: 'rgba(229,229,229,0.8)',
        }}
        animate={{
          width:  cursor.hotspot ? 4 : 3,
          height: cursor.hotspot ? 4 : 3,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />

      {/* ── Action label ────────────────────────────────────── */}
      <AnimatePresence>
        {cursor.hotspot && cursor.label && (
          <motion.span
            key="cursor-label"
            aria-hidden="true"
            className="fixed pointer-events-none z-[9999] font-body"
            style={{
              top:        cursor.y + 36,
              left:       cursor.x,
              translateX: '-50%',
              fontSize:   '8px',
              letterSpacing: '3px',
              color: 'rgba(229,229,229,0.7)',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {cursor.label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )
}
