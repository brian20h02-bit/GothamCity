import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── CSS-only dust particles (GPU-safe: opacity + transform only) ─────────────
const PARTICLE_COUNT = 20
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  key:      i,
  left:     `${Math.random() * 100}%`,
  top:      `${20 + Math.random() * 70}%`,
  size:     1 + Math.random() * 1.5,
  dur:      4 + Math.random() * 7,
  delay:    Math.random() * 6,
  dx:       (Math.random() - 0.5) * 30,
  dy:       -(15 + Math.random() * 45),
}))

function DustParticles() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <>
      <style>{`
        @keyframes dust {
          0%   { opacity: 0;   transform: translate(0, 0); }
          15%  { opacity: 0.35; }
          80%  { opacity: 0.15; }
          100% { opacity: 0;   transform: translate(var(--dx), var(--dy)); }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.key}
          aria-hidden="true"
          style={{
            position:   'absolute',
            left:       p.left,
            top:        p.top,
            width:      `${p.size}px`,
            height:     `${p.size}px`,
            borderRadius: '50%',
            background: 'rgba(229,229,229,0.5)',
            // @ts-expect-error CSS custom properties
            '--dx':     `${p.dx}px`,
            '--dy':     `${p.dy}px`,
            animation:  `dust ${p.dur}s ${p.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  )
}

export default function SceneArkhamAtrio() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* ── Wet-floor shimmer at base ─────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
        style={{
          height:     '25%',
          background: 'linear-gradient(to top, rgba(30,40,60,0.18) 0%, transparent 100%)',
        }}
      />

      {/* ── Dust particles ────────────────────────────────── */}
      <DustParticles />

      {/* ── Top header ───────────────────────────────────── */}
      <motion.div
        className="absolute top-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
      >
        <p className="font-body" style={{ fontSize: '7px', letterSpacing: '6px', color: 'rgba(229,229,229,0.12)' }}>
          MAIN RECEPTION — WING A — GROUND LEVEL
        </p>
      </motion.div>

      {/* ── Title ─────────────────────────────────────────── */}
      <motion.div
        className="absolute left-12 bottom-28"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
      >
        <p className="font-body mb-2" style={{ fontSize: '7px', letterSpacing: '5px', color: 'rgba(139,0,0,0.55)' }}>
          ARKHAM ASYLUM
        </p>
        <h1
          className="font-display text-white"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', letterSpacing: '6px', lineHeight: 1 }}
        >
          ATRIUM
        </h1>
        <p className="font-body mt-3" style={{ fontSize: '8px', letterSpacing: '3px', color: 'rgba(229,229,229,0.2)' }}>
          1,200 SQ. METERS — CONSTRUCTED 1898 — 312 PATIENT CAPACITY
        </p>
      </motion.div>

      {/* ── Dynamic light shaft ──────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-1/2"
        style={{
          width:      '1px',
          height:     '50%',
          background: 'linear-gradient(to bottom, rgba(200,210,220,0.08) 0%, transparent 100%)',
          transform:  'translateX(-50%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5], scaleX: [1, 1.5, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Horizontal depth markers ─────────────────────── */}
      {[0, 1].map(i => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute left-0 right-0"
          style={{
            top:        `${35 + i * 25}%`,
            height:     '1px',
            background: `rgba(229,229,229,${0.02 - i * 0.006})`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 0.6 + i * 0.3, ease: EASE }}
        />
      ))}

    </div>
  )
}
