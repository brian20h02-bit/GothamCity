import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'

export default function DetectiveMilestoneOverlay() {
  const { pendingMilestone, dismissMilestone } = useDetective()

  const is100 = pendingMilestone === '100'

  return (
    <AnimatePresence>
      {pendingMilestone && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-auto"
          style={{ zIndex: 8600 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissMilestone}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.88)' }} />
          <motion.div
            className="relative text-center px-10 max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="font-body mb-4"
              style={{
                fontSize: '8px',
                letterSpacing: '5px',
                color: is100 ? 'rgba(100,220,160,0.9)' : 'var(--blood)',
              }}
            >
              {is100 ? 'CASE CLOSED' : 'NEW CLASSIFIED DATA AVAILABLE'}
            </p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '5px', lineHeight: 1.1 }}
            >
              {is100 ? 'GOTHAM DATABASE COMPLETE' : 'CLEARANCE UPGRADE — LEVEL IV'}
            </h2>
            <p
              className="font-body mt-4"
              style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.35)' }}
            >
              INVESTIGATION {pendingMilestone}% — CLICK TO CONTINUE
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
