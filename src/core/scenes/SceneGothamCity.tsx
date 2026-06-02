import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SceneGothamCity() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
      {/* Bottom-left narrative block */}
      <div className="p-10 sm:p-16 max-w-xl">
        <motion.span
          className="block font-body mb-4"
          style={{ fontSize: '9px', letterSpacing: '5px', color: 'var(--blood)', opacity: 0.9 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          INTELLIGENCE BRIEFING — CLASSIFIED
        </motion.span>

        <motion.h1
          className="font-display text-white mb-4"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '4px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
        >
          GOTHAM<br />CITY
        </motion.h1>

        <motion.p
          className="font-body"
          style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', letterSpacing: '2px', color: 'var(--text-secondary)', lineHeight: 1.7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
        >
          Population: 10.2M. Homicide rate: 41.6 per 100k. <br />
          Active surveillance zones: 14. Fear index: CRITICAL.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-6"
          style={{ height: '1px', background: 'rgba(229,229,229,0.12)', transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: EASE }}
        />

        <motion.p
          className="font-body mt-4"
          style={{ fontSize: '8px', letterSpacing: '2.5px', color: 'rgba(229,229,229,0.25)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
        >
          MOVE YOUR CURSOR — FIND THE ENTRY POINT
        </motion.p>
      </div>
    </div>
  )
}
