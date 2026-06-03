import { AnimatePresence, motion } from 'framer-motion'
import { useDetective } from '@/core/detective/DetectiveContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FADE = 0.45

export default function DetectiveScanAnalysisOverlay() {
  const { scanMessageActive, scanHypothesis, scanPhase } = useDetective()

  return (
    <AnimatePresence>
      {scanMessageActive && scanHypothesis && (
        <motion.div
          key="scan-analysis"
          className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center"
          style={{ zIndex: 5200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE }}
        >
          <motion.div
            className="relative text-center px-8 max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: FADE, ease: EASE }}
          >
            <p
              className="font-body mb-3"
              style={{
                fontSize: '8px',
                letterSpacing: '5px',
                color: scanPhase === 'no_evidence'
                  ? 'rgba(180,180,180,0.75)'
                  : 'rgba(100,220,160,0.9)',
              }}
            >
              {scanHypothesis.title}
            </p>

            {scanHypothesis.lines.map(line => (
              <p
                key={line}
                className="font-display text-white"
                style={{
                  fontSize: scanPhase === 'no_evidence' ? '1rem' : 'clamp(1.1rem, 3vw, 1.6rem)',
                  letterSpacing: '4px',
                  lineHeight: 1.4,
                }}
              >
                {line}
              </p>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
