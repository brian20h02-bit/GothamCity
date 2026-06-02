import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const STATS = [
  { label: 'FOUNDED',   value: '1939' },
  { label: 'EMPLOYEES', value: '14,200' },
  { label: 'DIVISIONS', value: '12' },
  { label: 'FLOORS',    value: '42' },
]

export default function SceneWayneExterior() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* ── Corporate cool-blue tint ──────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(10,20,40,0.25) 0%, transparent 65%)' }}
      />

      {/* ── Top header ───────────────────────────────────── */}
      <motion.div
        className="absolute top-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
      >
        <p className="font-body" style={{ fontSize: '7px', letterSpacing: '6px', color: 'rgba(229,229,229,0.18)' }}>
          WAYNE ENTERPRISES — MIDTOWN GOTHAM — RESTRICTED ACCESS
        </p>
      </motion.div>

      {/* ── Main title ────────────────────────────────────── */}
      <motion.div
        className="absolute left-12 bottom-32"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
      >
        <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(229,229,229,0.3)' }}>
          WAYNE ENTERPRISES
        </p>
        <h1
          className="font-display text-white"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', letterSpacing: '6px', lineHeight: 1 }}
        >
          WAYNE TOWER
        </h1>
        <p className="font-body mt-3" style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.22)' }}>
          GOTHAM FINANCIAL DISTRICT — TALLEST STRUCTURE IN CITY
        </p>

        <motion.div
          className="mt-4"
          style={{ height: '1px', background: 'rgba(229,229,229,0.12)', originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
        />
      </motion.div>

      {/* ── Stats right side ─────────────────────────────── */}
      <motion.div
        className="absolute right-12 bottom-32 text-right"
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.65 }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 + i * 0.1 }}
          >
            <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}>
              {s.label}
            </p>
            <p className="font-body" style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(229,229,229,0.45)' }}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── City light pulses at base ─────────────────────── */}
      {[0.14, 0.09, 0.06].map((op, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute left-0 right-0"
          style={{ bottom: `${i * 8}%`, height: '1px', background: `rgba(229,229,229,${op})` }}
          animate={{ opacity: [op, op * 2.5, op] }}
          transition={{ duration: 3 + i * 1.5, repeat: Infinity, delay: i * 1.1 }}
        />
      ))}

    </div>
  )
}
