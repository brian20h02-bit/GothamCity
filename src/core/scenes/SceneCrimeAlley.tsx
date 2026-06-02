import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SceneCrimeAlley() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
      <div className="p-10 sm:p-16 max-w-xl">
        <motion.span
          className="block font-body mb-4"
          style={{ fontSize: '9px', letterSpacing: '5px', color: 'var(--blood)', opacity: 0.9 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          CASE FILE 001 — PARK ROW
        </motion.span>

        <motion.h1
          className="font-display text-white mb-4"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '4px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
        >
          CRIME<br />ALLEY
        </motion.h1>

        <motion.p
          className="font-body italic"
          style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', letterSpacing: '1.5px', color: 'var(--text-secondary)', lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          "Every city has a wound that never heals.<br />This one has a name."
        </motion.p>

        {/* Metadata row */}
        <motion.div
          className="mt-6 flex gap-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
        >
          {[
            { k: 'LOCATION', v: 'PARK ROW' },
            { k: 'STATUS', v: 'UNSOLVED' },
            { k: 'THREAT', v: 'EXTREME' },
          ].map(({ k, v }) => (
            <div key={k}>
              <p className="font-body" style={{ fontSize: '7px', letterSpacing: '2px', color: 'rgba(229,229,229,0.25)' }}>{k}</p>
              <p className="font-body" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(229,229,229,0.7)' }}>{v}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
