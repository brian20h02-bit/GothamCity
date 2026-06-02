import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigation } from '@/core/investigation/InvestigationContext'

const AUTO_DISMISS_MS = 3800

export default function EvidenceFoundOverlay() {
  const { pendingEvidence, dismissEvidenceNotification } = useInvestigation()

  const dismiss = useCallback(() => {
    dismissEvidenceNotification()
  }, [dismissEvidenceNotification])

  // Auto-dismiss
  useEffect(() => {
    if (!pendingEvidence) return
    const id = setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(id)
  }, [pendingEvidence, dismiss])

  return (
    <AnimatePresence>
      {pendingEvidence && (
        <motion.div
          key={pendingEvidence.id}
          className="fixed inset-0 pointer-events-auto flex items-center justify-center"
          style={{ zIndex: 8000 }}
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark scrim */}
          <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.78)' }} />

          {/* Scan line sweep */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0"
            style={{ height: '1px', background: 'rgba(229,229,229,0.12)' }}
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.2, ease: 'linear' }}
          />

          {/* Content */}
          <motion.div
            className="relative text-center px-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Top label */}
            <motion.p
              className="font-body mb-6"
              style={{ fontSize: '8px', letterSpacing: '6px', color: 'var(--blood)' }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              EVIDENCE RECOVERED
            </motion.p>

            {/* Horizontal rule */}
            <motion.div
              className="mx-auto mb-6"
              style={{ height: '1px', background: 'rgba(229,229,229,0.15)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Evidence title */}
            <motion.h2
              className="font-display text-white mb-4"
              style={{
                fontSize:      'clamp(2.2rem, 5vw, 3.5rem)',
                letterSpacing: '5px',
                lineHeight:    1,
              }}
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {pendingEvidence.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="font-body italic"
              style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-secondary)', lineHeight: 1.7 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {pendingEvidence.description}
            </motion.p>

            {/* Detail text */}
            <motion.p
              className="font-body mt-4"
              style={{ fontSize: '0.68rem', letterSpacing: '1.5px', color: 'rgba(229,229,229,0.3)', lineHeight: 1.8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {pendingEvidence.detail}
            </motion.p>

            {/* Dismiss hint */}
            <motion.p
              className="font-body mt-8"
              style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              CLICK TO CONTINUE
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
