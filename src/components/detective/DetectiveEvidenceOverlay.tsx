import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'
import { getInvestigationByScene } from '@/data/sceneInvestigations'
import { useScene } from '@/core/navigation/SceneContext'

const AUTO_DISMISS_MS = 3600

export default function DetectiveEvidenceOverlay() {
  const { pendingEvidence, dismissEvidence } = useDetective()
  const { currentScene } = useScene()
  const investigation = getInvestigationByScene(currentScene.id)

  const dismiss = useCallback(() => dismissEvidence(), [dismissEvidence])

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
          style={{ zIndex: 8500 }}
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(2,12,8,0.82)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          />

          <motion.div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ height: 2, background: 'rgba(100,220,160,0.5)', top: 0 }}
            initial={{ transform: 'translate3d(0,0,0)' }}
            animate={{ transform: 'translate3d(0,100vh,0)' }}
            transition={{ duration: 0.55, ease: 'linear' }}
          />

          <motion.div
            className="relative text-center px-8 max-w-lg"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.p
              className="font-body mb-4"
              style={{ fontSize: '8px', letterSpacing: '6px', color: 'rgba(100,220,160,0.9)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1, repeat: 2 }}
            >
              {investigation ? 'CASE FILE RECONSTRUCTED' : 'EVIDENCE RECOVERED'}
            </motion.p>
            {investigation && (
              <p className="font-body mb-3" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.45)' }}>
                {investigation.title}
              </p>
            )}
            <h2
              className="font-display text-white mb-2"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '4px' }}
            >
              {pendingEvidence.title}
            </h2>
            <p
              className="font-body mb-2"
              style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(100,200,140,0.5)' }}
            >
              {pendingEvidence.classification} — {pendingEvidence.location}
            </p>
            <p
              className="font-body"
              style={{ fontSize: '0.72rem', letterSpacing: '1.5px', color: 'rgba(229,229,229,0.55)', lineHeight: 1.7 }}
            >
              {pendingEvidence.description}
            </p>
            <p
              className="font-body mt-6"
              style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.25)' }}
            >
              CLICK TO CONTINUE
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
