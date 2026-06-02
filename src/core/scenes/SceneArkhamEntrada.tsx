import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function SceneArkhamEntrada() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* ── Red warning tint ──────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(80,0,0,0.18) 0%, transparent 65%)' }}
      />

      {/* ── Top classification strip ──────────────────────── */}
      <motion.div
        className="absolute top-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
      >
        <div style={{ border: '1px solid rgba(139,0,0,0.45)', padding: '5px 22px', background: 'rgba(5,5,5,0.65)' }}>
          <p className="font-body" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(200,30,30,0.85)' }}>
            RESTRICTED ZONE — ARKHAM ISLAND — UNAUTHORIZED ACCESS PROHIBITED
          </p>
        </div>
      </motion.div>

      {/* ── Main location title ───────────────────────────── */}
      <motion.div
        className="absolute left-12 bottom-32"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
      >
        <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(139,0,0,0.65)' }}>
          ARKHAM ASYLUM
        </p>
        <h1
          className="font-display text-white"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', letterSpacing: '6px', lineHeight: 1 }}
        >
          ENTRANCE
        </h1>
        <p className="font-body mt-3" style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.25)' }}>
          ESTABLISHED 1898 — GOTHAM ISLAND — ACTIVE FACILITY
        </p>

        {/* Horizontal rule */}
        <motion.div
          className="mt-4"
          style={{ height: '1px', background: 'rgba(139,0,0,0.3)', originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
        />
      </motion.div>

      {/* ── Vertical warning text — right side ───────────── */}
      <motion.div
        className="absolute right-10 top-1/2"
        style={{ transform: 'translateY(-50%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <motion.p
          className="font-body"
          style={{ fontSize: '6px', letterSpacing: '3px', color: 'rgba(139,0,0,0.55)', writingMode: 'vertical-rl' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          AUTHORIZED ACCESS ONLY — GCPD SECTOR 7
        </motion.p>
      </motion.div>

      {/* ── Distance marker lines ─────────────────────────── */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute left-0 right-0"
          style={{ top: `${25 + i * 18}%`, height: '1px', background: `rgba(229,229,229,${0.025 - i * 0.006})` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.6 + i * 0.2, ease: EASE }}
        />
      ))}

    </div>
  )
}
