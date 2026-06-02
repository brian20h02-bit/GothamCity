import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SceneArkhamFachada() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* ── Approaching depth vignette ────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,5,5,0.25) 100%)' }}
      />

      {/* ── "Approaching" indicator ───────────────────────── */}
      <motion.div
        className="absolute top-10 left-1/2"
        style={{ transform: 'translateX(-50%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      >
        <p className="font-body" style={{ fontSize: '7px', letterSpacing: '7px', color: 'rgba(229,229,229,0.15)' }}>
          — APPROACHING TARGET —
        </p>
      </motion.div>

      {/* ── Main title ────────────────────────────────────── */}
      <motion.div
        className="absolute left-12 bottom-28"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
      >
        <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(139,0,0,0.6)' }}>
          ARKHAM ASYLUM
        </p>
        <h1
          className="font-display text-white"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', letterSpacing: '6px', lineHeight: 1 }}
        >
          FACADE
        </h1>
        <p className="font-body mt-3" style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}>
          MAIN STRUCTURE — CIRCA 1898 — GOTHIC REVIVAL ARCHITECTURE
        </p>
      </motion.div>

      {/* ── Right side data column ───────────────────────── */}
      <motion.div
        className="absolute right-12 bottom-28 text-right"
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.6 }}
      >
        {(['WINGS', 'FLOORS', 'CAPACITY'] as const).map((label, i) => (
          <div key={label} className="mb-2">
            <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}>
              {label}
            </p>
            <p className="font-body" style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(229,229,229,0.4)' }}>
              {['6', '4', '312'][i]}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Depth lines (perspective effect) ─────────────── */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute left-0 right-0"
          style={{
            top:        `${18 + i * 22}%`,
            height:     '1px',
            background: `rgba(229,229,229,${0.022 - i * 0.005})`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, delay: 0.5 + i * 0.25, ease: EASE }}
        />
      ))}

    </div>
  )
}
