import { AnimatePresence, motion } from 'framer-motion'
import { useScene } from '@/core/navigation/SceneContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Cinematic scene transition — fade, vignette, scanline, brief motion blur.
 */
export default function ArchiveTransition() {
  const { transition } = useScene()
  const { active, type, phase } = transition
  const isMemory      = type === 'memory'
  const isBatcomputer = type === 'batcomputer'
  const isArchiveLike = !isMemory && !isBatcomputer

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="trans"
          className="fixed inset-0 select-none"
          style={{ zIndex: 9000, pointerEvents: 'none', willChange: 'opacity, filter' }}
          initial={{ opacity: 1 }}
          animate={{
            opacity: 1,
            filter: phase === 'freeze' ? 'blur(2px)' : 'blur(0px)',
          }}
          exit={{ opacity: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: isBatcomputer
                ? 'radial-gradient(ellipse at center, rgba(0,8,4,0.55) 0%, rgba(0,0,0,0.97) 100%)'
                : 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.94) 100%)',
            }}
            animate={{ opacity: phase === 'freeze' ? 1 : 0 }}
            transition={{ duration: phase === 'freeze' ? 0.45 : 0.55, ease: EASE }}
          />

          {isArchiveLike && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 14%, transparent 86%, rgba(0,0,0,0.6) 100%)',
              }}
              animate={{ opacity: phase === 'freeze' ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          )}

          {isArchiveLike && (
            <motion.div
              aria-hidden="true"
              className="absolute left-0 right-0"
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(229,229,229,0.35) 50%, transparent 100%)',
                top: 0,
              }}
              initial={{ transform: 'translate3d(0,-4px,0)', opacity: 0.8 }}
              animate={{
                transform: 'translate3d(0,100vh,0)',
                opacity: phase === 'freeze' ? 0.7 : 0,
              }}
              transition={{ duration: phase === 'freeze' ? 0.65 : 0.2, ease: 'linear' }}
            />
          )}

          {isBatcomputer && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(20,80,50,0.2) 0%, transparent 45%)' }}
              animate={{ opacity: phase === 'freeze' ? 0.95 : 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          )}

          <AnimatePresence>
            {phase === 'flash' && (
              <motion.div
                key="flash"
                className="absolute inset-0"
                style={{
                  background: isBatcomputer ? '#031208' : isMemory ? '#0a0a12' : '#0a0a0a',
                }}
                initial={{ opacity: isBatcomputer ? 0.45 : 0.35 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 1, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
