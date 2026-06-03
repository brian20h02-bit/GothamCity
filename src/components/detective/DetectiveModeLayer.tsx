import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'

/** Forensic tint — subtle, cinematic, not sci-fi HUD */
export default function DetectiveModeLayer() {
  const { active, activating } = useDetective()
  const show = active || activating

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="detective-layer"
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 4500 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(12,18,16,0.18)', mixBlendMode: 'multiply' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.08)' }} />

          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,8,6,0.25) 100%)',
            }}
          />

          <div className="absolute inset-0 detective-scanlines" style={{ opacity: 0.03 }} />

          <AnimatePresence>
            {activating && (
              <>
                <motion.div
                  key="flash"
                  className="absolute inset-0"
                  style={{ background: 'rgba(40,55,50,0.15)' }}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 1, 1] }}
                />
                <motion.div
                  key="scan-bar"
                  className="absolute left-0 right-0"
                  style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(80,100,90,0.35), transparent)',
                  }}
                  initial={{ transform: 'translate3d(0,-4px,0)' }}
                  animate={{ transform: 'translate3d(0,100vh,0)' }}
                  transition={{ duration: 0.7, ease: 'linear' }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
