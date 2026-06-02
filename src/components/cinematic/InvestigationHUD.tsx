import { motion, AnimatePresence } from 'framer-motion'
import { useInvestigation } from '@/core/investigation/InvestigationContext'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CLEARANCE_LABELS: Record<number, string> = {
  1: 'LEVEL  I',
  2: 'LEVEL II',
  3: 'LEVEL III',
  4: 'LEVEL IV',
  5: 'LEVEL  V',
}

export default function InvestigationHUD() {
  const { progress, foundCount, totalCount, clearanceLevel } = useInvestigation()

  const progressWidth = `${progress}%`

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-6 right-6 sm:top-8 sm:right-10 z-[500] pointer-events-none"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
      >
        <div
          className="flex flex-col gap-3 p-4"
          style={{
            background:   'rgba(5,5,5,0.72)',
            border:       '1px solid rgba(229,229,229,0.08)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            minWidth: '170px',
          }}
        >
          {/* ── INVESTIGATION ──────────────────────────── */}
          <div>
            <p className="font-body mb-1.5" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}>
              INVESTIGATION
            </p>

            {/* Progress bar */}
            <div className="mb-1" style={{ height: '1px', background: 'rgba(229,229,229,0.1)', position: 'relative' }}>
              <motion.div
                className="absolute top-0 left-0 h-full"
                style={{ background: 'rgba(229,229,229,0.55)', originX: 0 }}
                animate={{ width: progressWidth }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </div>

            <motion.p
              className="font-display text-white"
              style={{ fontSize: '1.1rem', letterSpacing: '2px' }}
              key={progress}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {progress}%
            </motion.p>
          </div>

          {/* ── Divider ────────────────────────────────── */}
          <div style={{ height: '1px', background: 'rgba(229,229,229,0.06)' }} />

          {/* ── EVIDENCE + CLEARANCE row ───────────────── */}
          <div className="flex justify-between gap-4">
            <div>
              <p className="font-body mb-0.5" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}>
                EVIDENCE
              </p>
              <motion.p
                className="font-display text-white"
                style={{ fontSize: '0.85rem', letterSpacing: '2px' }}
                key={foundCount}
                initial={{ opacity: 0.4, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {String(foundCount).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
              </motion.p>
            </div>

            <div>
              <p className="font-body mb-0.5" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.3)' }}>
                CLEARANCE
              </p>
              <motion.p
                className="font-display"
                style={{
                  fontSize:      '0.85rem',
                  letterSpacing: '1px',
                  color:         clearanceLevel >= 2 ? 'var(--blood)' : 'rgba(229,229,229,0.8)',
                }}
                key={clearanceLevel}
                initial={{ opacity: 0.4, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {CLEARANCE_LABELS[clearanceLevel] ?? 'LEVEL I'}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
