import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigation } from '@/core/investigation/InvestigationContext'

const AUTO_DISMISS_MS = 5500

type Phase = 'idle' | 'darken' | 'text' | 'flash' | 'done'

export default function FileUnlockedOverlay() {
  const { pendingFile, dismissFileNotification } = useInvestigation()
  const [phase, setPhase] = useState<Phase>('idle')

  const dismiss = useCallback(() => {
    dismissFileNotification()
    setPhase('idle')
  }, [dismissFileNotification])

  // Phase sequence
  useEffect(() => {
    if (!pendingFile) { setPhase('idle'); return }

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setPhase('darken'), 80))
    timers.push(setTimeout(() => setPhase('text'),   500))
    timers.push(setTimeout(() => setPhase('flash'),  2200))
    timers.push(setTimeout(() => setPhase('done'),   2600))
    timers.push(setTimeout(dismiss, AUTO_DISMISS_MS))

    return () => timers.forEach(clearTimeout)
  }, [pendingFile, dismiss])

  return (
    <AnimatePresence>
      {pendingFile && phase !== 'idle' && (
        <motion.div
          key={pendingFile.id}
          className="fixed inset-0 pointer-events-auto flex items-center justify-center"
          style={{ zIndex: 8500 }}
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{ duration: 0.25 }}
        >
          {/* Dark blanket */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#000' }}
            animate={{
              opacity: phase === 'darken' ? 0.85
                     : phase === 'text'   ? 0.9
                     : phase === 'flash'  ? 1
                     : 0.85,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Film grain */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
              opacity: 0.04,
              mixBlendMode: 'overlay' as const,
            }}
          />

          {/* Scan line */}
          {(phase === 'text' || phase === 'flash') && (
            <motion.div
              aria-hidden="true"
              className="absolute left-0 right-0"
              style={{ height: '1px', background: 'rgba(229,229,229,0.1)' }}
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 1.5, ease: 'linear' }}
            />
          )}

          {/* White flash */}
          {phase === 'flash' && (
            <motion.div
              className="absolute inset-0"
              style={{ background: '#fff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.12, 0] }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Content */}
          <AnimatePresence>
            {(phase === 'text' || phase === 'flash' || phase === 'done') && (
              <motion.div
                key="content"
                className="relative text-center px-8 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Pulsing status label */}
                <motion.p
                  className="font-body mb-8"
                  style={{ fontSize: '8px', letterSpacing: '7px', color: 'var(--blood)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  NEW FILE UNLOCKED
                </motion.p>

                {/* Case number */}
                <motion.p
                  className="font-body mb-3"
                  style={{ fontSize: '9px', letterSpacing: '5px', color: 'rgba(229,229,229,0.35)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {pendingFile.caseNumber}
                </motion.p>

                {/* File title */}
                <motion.h2
                  className="font-display text-white mb-3"
                  style={{
                    fontSize:      'clamp(3rem, 7vw, 6rem)',
                    letterSpacing: '6px',
                    lineHeight:    0.95,
                  }}
                  initial={{ opacity: 0, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  {pendingFile.title}
                </motion.h2>

                {/* Location */}
                <motion.p
                  className="font-body"
                  style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                >
                  {pendingFile.location}
                </motion.p>

                {/* Progress bar */}
                <div
                  className="mt-8 mx-auto"
                  style={{ width: '120px', height: '1px', background: 'rgba(229,229,229,0.1)', position: 'relative' }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full"
                    style={{ background: 'rgba(229,229,229,0.4)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'linear' }}
                  />
                </div>

                <motion.p
                  className="font-body mt-6"
                  style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.18)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  CLICK TO CONTINUE
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
