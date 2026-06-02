import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CinematicIntroProps {
  onComplete: () => void
}

type Phase = 'dark' | 'title' | 'classified' | 'granted' | 'exit'

const TIMINGS: Record<Phase, number> = {
  dark:       600,
  title:      900,
  classified: 800,
  granted:    900,
  exit:       700,
}

const EASE_CINEMA: [number, number, number, number] = [0.22, 1, 0.36, 1]

const textVariants = {
  hidden:  { opacity: 0, filter: 'blur(16px)', y: 6 },
  visible: { opacity: 1, filter: 'blur(0px)',  y: 0 },
  exit:    { opacity: 0, filter: 'blur(8px)',  y: -4 },
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>('dark')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const sequence: Phase[] = ['dark', 'title', 'classified', 'granted', 'exit']
    let accumulated = 0

    const timers = sequence.map((p) => {
      const t = setTimeout(() => setPhase(p), accumulated)
      accumulated += TIMINGS[p]
      return t
    })

    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 800)
    }, accumulated)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cinematic-intro"
          className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
          style={{ zIndex: 10000 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE_CINEMA }}
        >
          {/* Sweep scanline */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3.8, ease: 'linear', repeat: Infinity }}
          />

          {/* Subtle horizontal lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center select-none">

            {/* GOTHAM ARCHIVES */}
            <AnimatePresence mode="wait">
              {(phase === 'title' || phase === 'classified' || phase === 'granted') && (
                <motion.h1
                  key="title"
                  className="font-display text-white"
                  style={{
                    fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
                    letterSpacing: '10px',
                    lineHeight: 1,
                  }}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.9, ease: EASE_CINEMA }}
                >
                  GOTHAM ARCHIVES
                </motion.h1>
              )}
            </AnimatePresence>

            {/* CLASSIFIED DATABASE */}
            <AnimatePresence>
              {(phase === 'classified' || phase === 'granted') && (
                <motion.p
                  key="classified"
                  className="font-body text-[var(--text-secondary)]"
                  style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)', letterSpacing: '5px' }}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.7, ease: EASE_CINEMA }}
                >
                  CLASSIFIED DATABASE
                </motion.p>
              )}
            </AnimatePresence>

            {/* ACCESS GRANTED */}
            <AnimatePresence>
              {phase === 'granted' && (
                <motion.div
                  key="granted"
                  className="flex items-center gap-3"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.6, ease: EASE_CINEMA }}
                >
                  <motion.span
                    className="block w-1.5 h-1.5 rounded-full bg-[var(--light)]"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <span
                    className="font-body text-[var(--light)] font-medium"
                    style={{ fontSize: 'clamp(0.55rem, 1vw, 0.65rem)', letterSpacing: '5px' }}
                  >
                    ACCESS GRANTED
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom stamp */}
          <div
            className="absolute bottom-8 left-0 right-0 flex justify-center"
            aria-hidden="true"
          >
            <motion.span
              className="font-body text-[var(--text-muted)]"
              style={{ fontSize: '9px', letterSpacing: '3px' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              GIN — GOTHAM INTELLIGENCE NETWORK — CLASSIFIED
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
