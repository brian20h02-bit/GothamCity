import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const DIVISIONS = [
  'RESEARCH & DEVELOPMENT',
  'CLEAN ENERGY INITIATIVE',
  'URBAN INFRASTRUCTURE',
  'DEFENSE TECHNOLOGIES',
  'GLOBAL PARTNERSHIPS',
  'MEDICAL RESEARCH',
]

export default function SceneWayneLobby() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* ── Premium warm tint ────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(30,22,8,0.2) 0%, transparent 65%)' }}
      />

      {/* ── Top rule ─────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: '2px', background: 'rgba(229,229,229,0.05)', originX: 0 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />

      {/* ── Header ───────────────────────────────────────── */}
      <motion.div
        className="absolute top-8 left-12"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      >
        <p className="font-body mb-1" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(229,229,229,0.22)' }}>
          WAYNE ENTERPRISES
        </p>
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '5px' }}
        >
          MAIN LOBBY
        </h2>
        <p className="font-body mt-1" style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(229,229,229,0.16)' }}>
          GROUND FLOOR — VISITOR ACCESS
        </p>
      </motion.div>

      {/* ── Corporate divisions ───────────────────────────── */}
      <motion.div
        className="absolute right-10 top-1/2"
        style={{ transform: 'translateY(-50%)', maxWidth: '220px' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.6 }}
      >
        <p className="font-body mb-4" style={{ fontSize: '6px', letterSpacing: '4px', color: 'rgba(229,229,229,0.18)', textAlign: 'right' }}>
          ACTIVE DIVISIONS
        </p>
        {DIVISIONS.map((div, i) => (
          <motion.div
            key={div}
            className="flex items-center justify-end gap-2 mb-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
          >
            <p className="font-body" style={{ fontSize: '6px', letterSpacing: '2.5px', color: 'rgba(229,229,229,0.28)', textAlign: 'right' }}>
              {div}
            </p>
            <div style={{ width: '4px', height: '4px', background: 'rgba(229,229,229,0.2)', flexShrink: 0 }} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Floor indicator ──────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.9 }}
      >
        <p className="font-body" style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(229,229,229,0.18)' }}>
          FLOOR 00 — VISITOR CLEARANCE REQUIRED ABOVE FLOOR 10
        </p>
      </motion.div>

      {/* ── Marble floor shimmer ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{
          height:     '20%',
          background: 'linear-gradient(to top, rgba(230,220,200,0.04) 0%, transparent 100%)',
        }}
      />

    </div>
  )
}
