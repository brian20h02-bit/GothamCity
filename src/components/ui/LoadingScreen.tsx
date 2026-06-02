import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

const DURATION = 2500

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')

  useEffect(() => {
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(Math.floor(pct))

      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        setPhase('done')
        setTimeout(onComplete, 600)
      }
    }

    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  const lines = [
    'INITIALIZING SECURE CHANNEL...',
    'AUTHENTICATING CREDENTIALS...',
    'LOADING DISTRICT DATA...',
    'CONNECTING TO GIN SERVER...',
    'DECRYPTING SURVEILLANCE FEED...',
  ]

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Horizontal scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-accent/30" />
          <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-accent/30" />
          <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-accent/30" />
          <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-accent/30" />

          {/* Digital noise lines – left side */}
          <div className="absolute left-8 top-24 bottom-24 flex flex-col gap-2 opacity-30">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-[1px] bg-accent/50"
                style={{ width: `${8 + (i % 5) * 6}px` }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* Digital noise lines – right side */}
          <div className="absolute right-8 top-24 bottom-24 flex flex-col gap-2 opacity-30">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-[1px] bg-accent/50"
                style={{ width: `${8 + (i % 4) * 5}px` }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-xl w-full">
            {/* Logo mark */}
            <motion.div
              className="w-16 h-16 border border-accent/40 flex items-center justify-center"
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-8 h-8 border border-accent/60" style={{ transform: 'rotate(45deg)' }} />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <h1
                className="text-2xl sm:text-3xl font-display text-white"
                style={{ letterSpacing: '6px' }}
              >
                GOTHAM INTELLIGENCE NETWORK
              </h1>
              <p
                className="text-xs font-body text-accent"
                style={{ letterSpacing: '3px' }}
              >
                ACCESSING SECURE DATABASE...
              </p>
            </motion.div>

            {/* Log lines */}
            <div className="w-full space-y-1">
              {lines.map((line, i) => (
                <motion.p
                  key={line}
                  className="text-[10px] font-body text-text-secondary text-left"
                  style={{ letterSpacing: '1px' }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: progress > (i + 1) * 15 ? 0.6 : 0, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-accent/60 mr-2">›</span>
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] font-body text-text-secondary"
                  style={{ letterSpacing: '2px' }}
                >
                  SYSTEM STATUS
                </span>
                <motion.span
                  className="text-[10px] font-display text-accent"
                  style={{ letterSpacing: '2px' }}
                >
                  {progress}%
                </motion.span>
              </div>

              <div className="relative h-[2px] w-full bg-surface-2 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
                {/* shimmer on bar */}
                <motion.div
                  className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ left: `${Math.max(0, progress - 8)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
