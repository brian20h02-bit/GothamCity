import { motion, AnimatePresence } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'

const FADE = 0.25

/** Fase 1 — scan de 2 segundos, sin loops infinitos */
export default function DetectiveScanWave() {
  const { scanWave, scanPhase } = useDetective()
  const show = scanWave || scanPhase === 'wave'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="scan-wave"
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 4600 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE }}
        >
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${18 + i * 20}%`,
                background: 'linear-gradient(90deg, transparent, rgba(100,220,160,0.32), transparent)',
              }}
              initial={{ opacity: 0, scaleX: 0.2 }}
              animate={{ opacity: [0, 0.75, 0], scaleX: [0.2, 1, 0.2] }}
              transition={{ duration: 1.6, delay: i * 0.22, ease: 'easeInOut' }}
            />
          ))}

          <motion.div
            className="absolute rounded-full"
            style={{
              top: '50%',
              left: '50%',
              width: '40vmax',
              height: '40vmax',
              marginTop: '-20vmax',
              marginLeft: '-20vmax',
              border: '2px solid rgba(100,220,160,0.4)',
              boxShadow: '0 0 36px rgba(80,200,140,0.18)',
            }}
            initial={{ scale: 0, opacity: 0.65 }}
            animate={{ scale: 4.2, opacity: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(80,200,140,0.05)' }}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
