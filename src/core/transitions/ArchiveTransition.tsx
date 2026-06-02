import { AnimatePresence, motion } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Scene transition overlay — opacity + transform only (no blur / backdrop-filter).
 */
export default function ArchiveTransition() {
  const { transition } = useScene()
  const { active, type, phase } = transition
  const isMemory      = type === 'memory'
  const isBatcomputer = type === 'batcomputer'

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="trans"
          className="fixed inset-0 select-none"
          style={{ zIndex: 9000, pointerEvents: 'none', willChange: 'opacity' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Dark vignette */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: isBatcomputer
                ? 'radial-gradient(ellipse at center, rgba(0,8,4,0.5) 0%, rgba(0,0,0,0.95) 100%)'
                : 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)',
              willChange: 'opacity',
            }}
            animate={{ opacity: phase === 'freeze' ? 1 : 0 }}
            transition={{
              duration: phase === 'freeze' ? 0.18 : 0.22,
              ease:     EASE_OUT,
            }}
          />

          {/* Letter-box (archive only) */}
          {!isMemory && !isBatcomputer && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.55) 100%)',
                willChange: 'opacity',
              }}
              animate={{ opacity: phase === 'freeze' ? 1 : 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            />
          )}

          {/* Scanline (archive) */}
          {!isMemory && !isBatcomputer && (
            <motion.div
              aria-hidden="true"
              className="absolute left-0 right-0"
              style={{
                height:     '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(229,229,229,0.3) 50%, transparent 100%)',
                top:        0,
                willChange: 'transform, opacity',
              }}
              initial={{ transform: 'translate3d(0,-2px,0)', opacity: 0.7 }}
              animate={{
                transform: 'translate3d(0,100vh,0)',
                opacity:   phase === 'freeze' ? 0.6 : 0,
              }}
              transition={{ duration: phase === 'freeze' ? 0.32 : 0.08, ease: 'linear' }}
            />
          )}

          {/* Batcomputer: green data flash */}
          {isBatcomputer && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(20,80,50,0.15) 0%, transparent 40%)',
                willChange: 'opacity',
              }}
              animate={{ opacity: phase === 'freeze' ? 0.9 : 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}

          {/* Scene swap flash */}
          <AnimatePresence>
            {phase === 'flash' && (
              <motion.div
                key="flash"
                className="absolute inset-0"
                style={{
                  background: isBatcomputer ? '#031208' : isMemory ? '#0a0a12' : '#0a0a0a',
                  willChange: 'opacity',
                }}
                initial={{ opacity: isBatcomputer ? 0.35 : 0.2 }}
                animate={{ opacity: 0 }}
                transition={{ duration: isBatcomputer ? 0.22 : 0.2, ease: [0.4, 0, 1, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
