import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SceneTheIncident() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center max-w-2xl px-8">
        {/* Minimal — let the image speak first */}
        <motion.div
          className="mx-auto mb-10"
          style={{ width: '40px', height: '1px', background: 'rgba(139,0,0,0.7)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
        />

        <motion.h1
          className="font-display text-white"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            lineHeight: 1.1,
            letterSpacing: '6px',
          }}
          initial={{ opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.2, delay: 1, ease: EASE }}
        >
          SOME STORIES BEGIN<br />WITH A TRAGEDY.
        </motion.h1>

        <motion.div
          className="mx-auto mt-10"
          style={{ width: '40px', height: '1px', background: 'rgba(229,229,229,0.12)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 2, ease: EASE }}
        />

        <motion.p
          className="font-body mt-6 italic"
          style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'rgba(229,229,229,0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.4, ease: EASE }}
        >
          THE WAYNE INCIDENT — PARK ROW — UNRESOLVED
        </motion.p>
      </div>
    </div>
  )
}
